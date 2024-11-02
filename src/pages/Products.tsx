import styled from "styled-components";
import ProductsContainer from "../components/products/ProductsContainer";
import useScreenWidth from "../hooks/useScreenWidth";
import { MEDIA_QUERY } from "../constants/mediaQuery";
import PRODUCT_SORT_BY from "../constants/productSortBy";
import useProducts from "../hooks/useProducts";
import PROP_VALUES from "../constants/propValues";
import ProductsBar from "../components/products/ProductsBar";
import { useAtomValue } from "jotai";
import productSearchKeywordState from "../jotai/atoms/productSearchKeywordState";
import productSortByState from "../jotai/atoms/productSortByState";
import PageIndex from "../components/common/PageIndex";
import { useEffect, useState } from "react";

const PageContainer = styled.div`
  width: 120rem;
  ${(props) => props.theme.media.medium} {
    max-width: 69.6rem;
  }
  ${(props) => props.theme.media.small} {
    max-width: 34.4rem;
  }
`;

const BestProductSection = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 2.6rem;
  h1 {
    font-size: 2rem;
    color: ${(props) => props.theme.color.subBlack};
    margin-bottom: 1.5rem;
    line-height: 3.2rem;
    font-weight: 700;
  }
`;

const ProductsContainerComponent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 14rem;
  gap: 2.3rem;
  ${(props) => props.theme.media.medium} {
    gap: 1.6rem;
  }
  ${(props) => props.theme.media.small} {
    gap: 0.8rem;
  }
`;

function Products() {
  const screenWidth = useScreenWidth();
  const searchKeyword = useAtomValue(productSearchKeywordState);
  const productSortBy = useAtomValue(productSortByState);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(() => {
    if (screenWidth)
      return {
        best: MEDIA_QUERY.bestProductsPageSize[screenWidth],
        normal: MEDIA_QUERY.productsPageSize[screenWidth],
      };
  });

  const bestProducts = useProducts({
    pageSize: pageSize?.best ?? 4,
    orderBy: PRODUCT_SORT_BY.favorite.parameter,
  });
  const products = useProducts({
    pageSize: pageSize?.normal ?? 10,
    orderBy: productSortBy,
    searchKeyword,
    page,
  });

  useEffect(() => {
    if (screenWidth)
      setPageSize({
        best: MEDIA_QUERY.bestProductsPageSize[screenWidth],
        normal: MEDIA_QUERY.productsPageSize[screenWidth],
      });
  }, [screenWidth]);

  useEffect(() => {
    bestProducts.refetch();
    products.refetch();
  }, [screenWidth, productSortBy, searchKeyword, page]);

  return (
    <PageContainer>
      <BestProductSection>
        <h1>베스트 상품</h1>
        <ProductsContainerComponent>
          {<ProductsContainer {...bestProducts} size={PROP_VALUES.product.big}></ProductsContainer>}
          <ProductsBar screenWidth={screenWidth} />
          {<ProductsContainer {...products} size={PROP_VALUES.product.small}></ProductsContainer>}
          <PageIndex page={page} setPage={setPage} />
        </ProductsContainerComponent>
      </BestProductSection>
    </PageContainer>
  );
}

export default Products;
