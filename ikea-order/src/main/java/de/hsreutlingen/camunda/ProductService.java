package de.hsreutlingen.camunda;

import java.util.Arrays;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;



@Path("product/")
@Produces({ "application/json" })
@Consumes({ "application/json" })
@Stateless
public class ProductService {

	@PersistenceContext
	private EntityManager entityManager;

	@PostConstruct
	private void init() {
		this.checkAndEnsureDemoData();
	}
	
	private void checkAndEnsureDemoData() {

		List<ProductEntity> products = entityManager.createQuery("Select p From ProductEntity p").getResultList();

		if (products.isEmpty()) {
			ProductEntity product = new ProductEntity();
			product.setAmount(20);
			product.setPrice(100.50);
			product.setName("Billy");
			entityManager.persist(product);

			ProductEntity product1 = new ProductEntity();
			product1.setAmount(20);
			product1.setPrice(110.50);
			product1.setName("Klijka");
			entityManager.persist(product1);

			ProductEntity product2 = new ProductEntity();
			product2.setAmount(20);
			product2.setPrice(200.50);
			product2.setName("Valjik");
			entityManager.persist(product2);
		}
	}
	
	@GET
	@Path("")
	public ProductEntity[] getProductEntities() {	
		List<ProductEntity> entities= entityManager.createQuery("Select p from ProductEntity p").getResultList();
		
		return entities.toArray(new ProductEntity[entities.size()]);
	}

	@GET
	@Path("test")
	public String test() {	
		
		return "test";
	}
	

}
