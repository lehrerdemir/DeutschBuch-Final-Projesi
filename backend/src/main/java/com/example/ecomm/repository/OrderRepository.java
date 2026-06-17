package com.example.ecomm.repository;

import com.example.ecomm.model.Order;
import com.example.ecomm.model.OrderStatus;
import com.example.ecomm.model.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserUidOrderByCreatedAtDesc(String userUid);
    boolean existsByPaymentIntentId(String paymentIntentId);

    @Query("""
            select o from Order o
            where (:email is null or :email = '' or lower(o.userEmail) like lower(concat('%', :email, '%')))
              and (:phone is null or :phone = '' or o.phone like concat('%', :phone, '%'))
              and (:paymentStatus is null or o.paymentStatus = :paymentStatus)
              and (:orderStatus is null or o.orderStatus = :orderStatus)
            order by
              case when o.orderStatus is null or o.orderStatus = com.example.ecomm.model.OrderStatus.NEW_ORDER then 0 else 1 end,
              o.createdAt desc
            """)
    List<Order> adminSearch(
            @Param("email") String email,
            @Param("phone") String phone,
            @Param("paymentStatus") PaymentStatus paymentStatus,
            @Param("orderStatus") OrderStatus orderStatus
    );
}
