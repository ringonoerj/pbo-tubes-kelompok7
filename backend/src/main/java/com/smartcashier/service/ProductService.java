package com.smartcashier.service;

import com.smartcashier.entity.Product;
import com.smartcashier.repository.ProductRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Integer id) {
        return productRepository.findById(id);
    }

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Integer id, Product productDetails) {
        Optional<Product> optionalProduct = productRepository.findById(id); // wait, let's use findById
        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();
            product.setProductName(productDetails.getProductName());
            product.setCategory(productDetails.getCategory());
            product.setQuantity(productDetails.getQuantity());
            product.setPrice(productDetails.getPrice());
            return productRepository.save(product);
        }
        throw new RuntimeException("Product not found with id: " + id);
    }

    public void deleteProduct(Integer id) {
        productRepository.deleteById(id);
    }

    public synchronized void decreaseStock(Integer id, int qty) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();
            if (product.getQuantity() < qty) {
                throw new RuntimeException("Stok tidak mencukupi untuk produk: " + product.getProductName());
            }
            product.setQuantity(product.getQuantity() - qty);
            productRepository.save(product);
        } else {
            throw new RuntimeException("Product not found with id: " + id);
        }
    }
}
