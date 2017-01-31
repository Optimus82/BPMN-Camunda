package de.hsreutlingen.camunda;

import java.util.Arrays;
import java.util.List;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

@Path("order/")
@Produces({ "application/json" })
@Consumes({ "application/json" })
@Stateless
public class OrderService {

	@PersistenceContext
	private EntityManager entityManager;

	public OrderService() {

	}

	@GET
	@Path("")
	public OrderEntity[] getOrderEntities(@QueryParam("customer") String customer,@QueryParam("status") String status) {

		List<OrderEntity> entities;
		if (customer != null && !customer.isEmpty()) {
			entities = entityManager.createQuery("Select o from OrderEntity o WHERE o.customer LIKE :mCustomer")
					.setParameter("mCustomer", customer).getResultList();
		}else if(status != null && !status.isEmpty()) {
			entities = entityManager.createQuery("Select o from OrderEntity o WHERE o.status LIKE :mStatus")
					.setParameter("mStatus", status).getResultList();
		}
		else {
			entities = entityManager.createQuery("Select o from OrderEntity o").getResultList();
		}
		
		//entities = entityManager.createQuery("Select o from OrderEntity o").getResultList();

		return entities.toArray(new OrderEntity[entities.size()]);
	}

	@GET
	@Path("test")
	public String test() {

		return "test";
	}

}
