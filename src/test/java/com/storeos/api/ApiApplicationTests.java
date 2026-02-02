package com.storeos.api;

import com.storeos.api.entity.*;
import com.storeos.api.repository.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;


@SpringBootTest // 스프링 컨테이너를 진짜로 띄워서 테스트함
@Transactional  // 테스트 끝나면 데이터 깔끔하게 지워줌 (DB 더러워지는 것 방지)
@Rollback(false) // 🚨 눈으로 확인해야 하니까 지우지 말고 DB에 남겨놔! (공부용 설정)

class ApiApplicationTests {

	@Autowired StoreRepository storeRepository;
    @Autowired UsersRepository usersRepository;
    @Autowired StoreTableRepository storeTableRepository;
    @Autowired CategoryRepository categoryRepository;
    @Autowired ProductRepository productRepository;
    @Autowired OrdersRepository ordersRepository;
    @Autowired OrderDetailRepository orderDetailRepository;
	@Autowired IngredientRepository ingredientRepository;
    @Autowired RecipeRepository recipeRepository;

	@Test
	void contextLoads() {
		// 1. 매장 등록 시나리오
		Store store = new Store("스타벅스 강남점", "123-45-67890", "손지민");
		storeRepository.save(store);
		System.out.println("1. 매장 등록 완료 " + store.getStoreName());

		// 2. 직원 채용
		Users staff = new Users("worker1", "1234", UsersRole.STAFF, store);
		usersRepository.save(staff);
		System.out.println("2. 직원 채용 완료 : " + staff.getLoginId());

		// 3. 테이블 배치
		StoreTable table = new StoreTable(10,10,100,100, 4, TableStatus.EMPTY, store);
		storeTableRepository.save(table);
		System.out.println("3. 테이블 배치 완료 : " + table.getTableId() + "번 테이블");

		// 4. 카테고리 & 상품 등록
		Category coffeeCategory = new Category("커피", store);
		categoryRepository.save(coffeeCategory);
		System.out.println("4-1. 커피 등록 완료 : " + coffeeCategory.getCategoryName());

		Category desertCategory = new Category("디저트", store);
		categoryRepository.save(desertCategory);
		System.out.println("4-2. 디저트 등록 완료 : " + desertCategory.getCategoryName());

		Product americano = new Product("아메리카노",4500,ProductStatus.SALE, coffeeCategory);
		productRepository.save(americano);
		System.out.println("4-3. 아메리카노 등록 완료 : \n 분류 : " + americano.getCategory());

		//5. 재료 & 레시피등록

		Ingredient bean = new Ingredient("에티오피아 원두", 1000, "g", store);
        ingredientRepository.save(bean);
        System.out.println("✅ 5-1. 재료 입고: 원두 1000g");
        
        Recipe americanoRecipe = new Recipe(20L, americano, bean);
        recipeRepository.save(americanoRecipe);
        System.out.println("✅ 5-2. 레시피 등록: 아메리카노엔 원두 20g이 들어갑니다.");

		// 6. 주문서 생성
		Orders orders = new Orders(1L, PaymentMethod.CARD, store, staff, table);
		ordersRepository.save(orders);
		System.out.println("6. 주문 생성 : " + orders.getOrderId() + "번 주문");

		// 7. 주문서 상세 내용 적기
		OrderDetail detail = new OrderDetail(2L, orders, americano);
		orderDetailRepository.save(detail);
		System.out.println("6. 주문 상세 내용 적기 : " + detail.getOrders().getOrderId() + "번 주문\n" + 
							bean.getIngredientName() + americanoRecipe.getQuantity() + bean.getUnit() + "소진됨");


		
	}

}
