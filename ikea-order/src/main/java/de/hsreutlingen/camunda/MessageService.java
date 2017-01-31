package de.hsreutlingen.camunda;

import java.util.List;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

@Path("message/")
@Produces({ "application/json" })
@Consumes({ "application/json" })
@Stateless
public class MessageService {

	@PersistenceContext
	private EntityManager entityManager;

	public MessageService() {

	}

	@GET
	@Path("")
	public MessageEntity[] getMessageEntities(@QueryParam("customer") String customer) {

		List<MessageEntity> entities;
		if (customer != null && !customer.isEmpty()) {
			entities = entityManager.createQuery("Select m from MessageEntity m WHERE m.customer LIKE :mCustomer")
					.setParameter("mCustomer", customer).getResultList();
		}
		else {
			entities = entityManager.createQuery("Select m from MessageEntity m").getResultList();
		}

		return entities.toArray(new MessageEntity[entities.size()]);
	}

	@GET
	@Path("test")
	public String test() {

		return "test";
	}

}
