package com.storeos.api;

import com.storeos.api.entity.*;
import com.storeos.api.repository.*;
import org.junit.jupiter.api.Test;
import com.storeos.api.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;


@SpringBootTest // 스프링 컨테이너를 진짜로 띄워서 테스트함
@Transactional  // 테스트 끝나면 데이터 깔끔하게 지워줌 (DB 더러워지는 것 방지)
@Rollback(false) // 🚨 눈으로 확인해야 하니까 지우지 말고 DB에 남겨놔! (공부용 설정)

class ApiApplicationTests {
	//서비스 autowire
	@Autowired OrderService orderService;
	@Autowired UserService userService;
	//레포지토리 autowire
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
	void serviceTest() {
		// 1. 매장 등록 시나리오
		Store store = new Store("스타벅스 강남점", "123-45-67890", "손지민");
		storeRepository.save(store);
		System.out.println("1. 매장 등록 완료 " + store.getStoreName());

		// 2. 직원 채용
		String loginId = userService.registerUser("손지민", "jamie1608", "1234", UsersRole.OWNER, store.getStoreId());
		System.out.println("2. 직원 채용 완료 : " + loginId);
		
		// 등록된 직원 조회
		Users users = usersRepository.findByLoginId(loginId).orElseThrow();

		

		// 3. 테이블 배치
		StoreTable table = new StoreTable(10,10,100,100, 4, store);
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

		// 5. 재료 & 레시피등록

		Ingredient bean = new Ingredient("에티오피아 원두", 1000, "g", store);
        ingredientRepository.save(bean);
        System.out.println("✅ 5-1. 재료 입고: 원두 1000g");
        
        Recipe americanoRecipe = new Recipe(20L, americano, bean);
        recipeRepository.save(americanoRecipe);
        System.out.println("✅ 5-2. 레시피 등록: 아메리카노엔 원두 20g이 들어갑니다.");

		// 6. 주문서 생성
		Long orderId = orderService.createOrder(
			store.getStoreId(),
			users.getUserId(),
			table.getTableId(),
			PaymentMethod.CARD
		);
		System.out.println("6. 주문 생성 : " + orderId + "번 주문");

		// 7. 주문서 상세 내용 적기
		orderService.AdditemToOrder(2L, orderId, americano.getProductId());;
		System.out.println("6. 주문 상세 내용 적기 : " + orderId + "번 주문\n" + 
							bean.getIngredientName() + americanoRecipe.getQuantity() + bean.getUnit() + "소진됨");


		
	}

}
