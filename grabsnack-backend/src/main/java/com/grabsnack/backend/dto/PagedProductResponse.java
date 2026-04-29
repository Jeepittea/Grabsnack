package com.grabsnack.backend.dto;

import com.grabsnack.backend.model.Product;

import java.util.List;

public class PagedProductResponse {

    private List<Product> products;
    private PaginationMeta pagination;

    public PagedProductResponse(List<Product> products, int page, int limit, long total) {
        this.products = products;
        this.pagination = new PaginationMeta(page, limit, total, (int) Math.ceil((double) total / limit));
    }

    public List<Product> getProducts()               { return products; }
    public PaginationMeta getPagination()            { return pagination; }

    public static class PaginationMeta {
        private final int page;
        private final int limit;
        private final long total;
        private final int pages;

        public PaginationMeta(int page, int limit, long total, int pages) {
            this.page = page; this.limit = limit; this.total = total; this.pages = pages;
        }

        public int getPage()    { return page; }
        public int getLimit()   { return limit; }
        public long getTotal()  { return total; }
        public int getPages()   { return pages; }
    }
}
