package com.storeos.api;

import com.storeos.api.dto.LoginResponseDto;
import com.storeos.api.entity.*;
import com.storeos.api.repository.*;
import org.junit.jupiter.api.Test;
import com.storeos.api.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest // 스프링 컨테이너를 진짜로 띄워서 테스트함
//@Transactional  // 테스트 끝나면 데이터 깔끔하게 지워줌 (DB 더러워지는 것 방지)
@Rollback(false) // 🚨 눈으로 확인해야 하니까 지우지 말고 DB에 남겨놔! (공부용 설정)

public class LoginFailTest {
    
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
    void loginfailtest(){
        Store store = new Store("테스트매장", "000-00-00000", "사장");
        storeRepository.save(store);
        userService.registerUser("손지민", "jamie1608", "1234", UsersRole.OWNER, store.getStoreId());
        System.out.println("--- 로그인 실패 테스트 시작 ---");
        
         // 2-1. 직원 로그인 with jamie1 (wrong id)
        try{
            LoginResponseDto result = userService.loginUser("jamie1", "1111", store.getStoreId());
            System.out.println("결과 : " + result);
        }
        catch (RuntimeException e){
            System.out.println("에러 발생함 : " + e.getMessage());
        }

        // 2-2. 직원 로그인 with jamie1608 / 1111 (correct id, wrong password)
        try{
            LoginResponseDto result = userService.loginUser("jamie1608", "1111", store.getStoreId());
            System.out.println("결과 : " + result);
        }
        catch (RuntimeException e){
            System.out.println("에러 발생함 : " + e.getMessage());
        }

        // 2-3. 직원 로그인 with jamie1608 / 1234 (correct id, correct password)
        try{
            LoginResponseDto result = userService.loginUser("jamie1608", "1234", store.getStoreId());
            System.out.println("결과 : " + result);
        }
        catch (RuntimeException e){
            System.out.println("에러 발생함 : " + e.getMessage());
        }
    }
}
