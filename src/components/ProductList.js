import { ClayCheckbox } from "@clayui/form";
import ClayTable from "@clayui/table";
import React from "react";

function ProductList({ onSelect, products, selectedProductIds }) {
  const lang = themeDisplay.getLanguageId();

  return (
    <ClayTable>
      <ClayTable.Head>
        <ClayTable.Row>
          <ClayTable.Cell headingCell></ClayTable.Cell>
          <ClayTable.Cell headingCell>{"Name"}</ClayTable.Cell>
          <ClayTable.Cell headingCell>{"Description"}</ClayTable.Cell>
          <ClayTable.Cell headingCell>{"ID"}</ClayTable.Cell>
          <ClayTable.Cell headingCell>{"Product ID"}</ClayTable.Cell>
          <ClayTable.Cell headingCell>{"State"}</ClayTable.Cell>
        </ClayTable.Row>
      </ClayTable.Head>
      <ClayTable.Body>
        {products &&
          products.map((product) => (
            <ClayTable.Row key={product.productId}>
              <ClayTable.Cell className="entry-selector lfr-checkbox-column text-left text-middle">
                <ClayCheckbox
                  checked={
                    selectedProductIds &&
                    selectedProductIds.includes(product.productId)
                  }
                  onChange={() => onSelect(product.productId)}
                />
              </ClayTable.Cell>
              <ClayTable.Cell headingTitle>{product.name[lang]}</ClayTable.Cell>
              <ClayTable.Cell expanded truncate>
                {product.description[lang]}
              </ClayTable.Cell>
              <ClayTable.Cell>{product.id}</ClayTable.Cell>
              <ClayTable.Cell>{product.productId}</ClayTable.Cell>
              <ClayTable.Cell>
                {product.active ? "Active" : "Deactivated"}
              </ClayTable.Cell>
            </ClayTable.Row>
          ))}
      </ClayTable.Body>
    </ClayTable>
  );
}

export default ProductList;
