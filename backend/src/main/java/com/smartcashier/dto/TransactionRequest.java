package com.smartcashier.dto;

import java.util.List;

public class TransactionRequest {
    private String memberPhone;
    private List<ItemRequest> items;

    public TransactionRequest() {}

    public String getMemberPhone() { return memberPhone; }
    public void setMemberPhone(String memberPhone) { this.memberPhone = memberPhone; }

    public List<ItemRequest> getItems() { return items; }
    public void setItems(List<ItemRequest> items) { this.items = items; }

    public static class ItemRequest {
        private Integer productId;
        private int quantity;

        public ItemRequest() {}

        public Integer getProductId() { return productId; }
        public void setProductId(Integer productId) { this.productId = productId; }

        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
    }
}
