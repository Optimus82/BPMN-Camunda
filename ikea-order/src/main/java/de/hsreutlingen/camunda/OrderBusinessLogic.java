/* Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package de.hsreutlingen.camunda;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.joda.time.DateTime;

import javax.annotation.PostConstruct;
import javax.ejb.Stateless;
import javax.inject.Named;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import java.util.Date;
import java.util.List;
import java.util.Map;

@Stateless
@Named
public class OrderBusinessLogic {

	
	
	
	// Inject the entity manager
	@PersistenceContext
	private EntityManager entityManager;


	public void persistOrder(DelegateExecution delegateExecution) {

	}

	public void setOrderStateAccepted(DelegateExecution delegateExecution) {
		boolean orderOK = (boolean) delegateExecution.getVariable("orderOK");
		String token = delegateExecution.getVariable("token").toString();

		OrderEntity order = (OrderEntity) entityManager
				.createQuery("SELECT o FROM OrderEntity o WHERE o.token LIKE :mToken").setParameter("mToken", token)
				.getResultList().get(0);

		if (orderOK) {
			order.setStatus("ACCEPTED");
		} else {
			order.setStatus("REJECTED");
		}

		entityManager.merge(order);

	}

	public void setOrderState(DelegateExecution delegateExecution, String state) {

		String token = delegateExecution.getVariable("token").toString();

		OrderEntity order = (OrderEntity) entityManager
				.createQuery("SELECT o FROM OrderEntity o WHERE o.token LIKE :mToken").setParameter("mToken", token)
				.getResultList().get(0);

		order.setStatus(state);

		entityManager.merge(order);
	}

	public void sendMessage(DelegateExecution delegateExecution, String message, String type) {

		String token = delegateExecution.getVariable("token").toString();

		OrderEntity order = (OrderEntity) entityManager
				.createQuery("SELECT o FROM OrderEntity o WHERE o.token LIKE :mToken").setParameter("mToken", token)
				.getResultList().get(0);

		MessageEntity sMessage = new MessageEntity();
		sMessage.setMessage(message);
		sMessage.setAmount(order.getAmount());
		sMessage.setProduct(order.getProduct());
		sMessage.setProductId(order.getProductId());
		sMessage.setTimeStamp(new Date());
		sMessage.setCustomer(order.getCustomer());
		sMessage.setToken(order.getToken());
		sMessage.setType(type);
		sMessage.setOrderId(order.getId());

		entityManager.persist(sMessage);

		System.out.println(
				message + " Für Bestellung von " + order.amount + " " + order.product + " vom " + order.timeStamp);

	}

	public void noticeCarrier(DelegateExecution delegateExecution) {

		String token = delegateExecution.getVariable("token").toString();

		OrderEntity order = (OrderEntity) entityManager
				.createQuery("SELECT o FROM OrderEntity o WHERE o.token LIKE :mToken").setParameter("mToken", token)
				.getResultList().get(0);

		order.setStatus("READYTODELIVER");

		sendMessage(delegateExecution, "Zahlung eingegangen, Ware wird versandt", "INFO");

		entityManager.merge(order);

	}

	public void checkOrder(DelegateExecution delegateExecution) {

			String productName = delegateExecution.getVariable("product").toString();

			ProductEntity product = (ProductEntity) entityManager
					.createQuery("SELECT p FROM ProductEntity p WHERE p.name LIKE :prodName")
					.setParameter("prodName", productName).getResultList().get(0);

			int amount = Integer.parseInt(delegateExecution.getVariable("amount").toString());

			String customer = delegateExecution.getVariable("mail").toString();
			String token = delegateExecution.getVariable("token").toString();

			OrderEntity order = new OrderEntity();
			order.setAmount(amount);
			order.setCustomer(customer);
			order.setProduct(productName);
			order.setProductId(product.id);
			order.setToken(token);
			order.setStatus("OPEN");
			order.setTimeStamp(new Date());
			order.setPrice((product.price * amount));
			entityManager.persist(order);

			if (product.amount >= amount) {
				delegateExecution.setVariable("productAvailable", true);
				delegateExecution.setVariable("price", product.price * amount);

			} else {
				delegateExecution.setVariable("productAvailable", false);
			}


	}

	public void releaseProductReservation(DelegateExecution delegateExecution) {
		int amount = Integer.parseInt(delegateExecution.getVariable("amount").toString());
		String productName = delegateExecution.getVariable("product").toString();
		
		ProductEntity product = (ProductEntity) entityManager
				.createQuery("SELECT p FROM ProductEntity p WHERE p.name LIKE :prodName")
				.setParameter("prodName", productName).getResultList().get(0);
	
		product.setAmount(product.amount + amount);
		entityManager.merge(product);
	}
	
	
	public void reserveProduct(DelegateExecution delegateExecution){
		int amount = Integer.parseInt(delegateExecution.getVariable("amount").toString());
		String productName = delegateExecution.getVariable("product").toString();
		
		ProductEntity product = (ProductEntity) entityManager
				.createQuery("SELECT p FROM ProductEntity p WHERE p.name LIKE :prodName")
				.setParameter("prodName", productName).getResultList().get(0);
	
		product.setAmount(product.amount - amount);
		entityManager.merge(product);
		
	}

}
