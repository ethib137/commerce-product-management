import ClayButton from "@clayui/button";
import { ClayCheckbox, ClayInput } from "@clayui/form";
import ClayManagementToolbar from "@clayui/management-toolbar";
import { ClayPaginationBarWithBasicItems } from "@clayui/pagination-bar";
import React, { useCallback, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

import useInterval from "../hooks/useInterval";
import { fetch } from "../util/fetch";
import LoadingContainer from "./LoadingContainer";
import ProductList from "./ProductList";

const URL_PRODUCTS = "/o/headless-commerce-admin-catalog/v1.0/products";

const DELTAS = [
  {
    label: 10,
  },
  {
    label: 20,
  },
  {
    label: 50,
  },
  {
    label: 100,
  },
];

const spritemap = themeDisplay.getPathThemeImages() + "/lexicon/icons.svg";

function App() {
  const [products, setProducts] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [processId, setProcessId] = useState(-1);
  const [executeStatus, setExecuteStatus] = useState();
  const [activePage, setActivePage] = useState(1);
  const [delta, setDelta] = useState(20);
  const [totalProducts, setTotalProducts] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [debouncedSearch] = useDebounce(search, 400);

  const fetchProducts = useCallback(() => {
    setLoading(true);

    fetch(
      `${URL_PRODUCTS}?search=${debouncedSearch}&page=${activePage}&pageSize=${delta}`
    ).then((res) => {
      setProducts(res.items);
      setTotalProducts(res.totalCount);

      setLoading(false);
    });
  }, [setProducts, activePage, delta, debouncedSearch]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useInterval(
    () => {
      fetch(`/o/headless-batch-engine/v1.0/import-task/${processId}`).then(
        (res) => {
          setExecuteStatus(res.executeStatus);

          if (res.executeStatus === "COMPLETED") {
            setProcessId(-1);

            fetchProducts();
          }
        }
      );
    },
    processId >= 0 ? 1000 : null
  );

  const handleDelete = useCallback(() => {
    const data = selectedProductIds.map((id) => ({ id }));

    setLoading(true);

    fetch(
      `/o/headless-batch-engine/v1.0/import-task/com.liferay.headless.commerce.admin.catalog.dto.v1_0.Product`,
      {
        data,
        method: "DELETE",
      }
    ).then((res) => {
      setExecuteStatus(res.executeStatus);
      setProcessId(res.id);
      setSelectedProductIds([]);
    });
  }, [
    selectedProductIds,
    setExecuteStatus,
    setProcessId,
    setSelectedProductIds,
  ]);

  const handleProductSelect = useCallback(
    (productId) => {
      let newSelectedProductIds;

      if (selectedProductIds.includes(productId)) {
        newSelectedProductIds = selectedProductIds.filter(
          (selectedProductId) => selectedProductId !== productId
        );
      } else {
        newSelectedProductIds = [...selectedProductIds, productId];
      }

      setSelectedProductIds(newSelectedProductIds);
    },
    [selectedProductIds, setSelectedProductIds]
  );

  const handleSelectAll = useCallback(
    (allSelected) => {
      let newSelectedProductIds;

      if (allSelected) {
        newSelectedProductIds = [];
      } else {
        newSelectedProductIds = products.map((product) => product.productId);
      }

      setSelectedProductIds(newSelectedProductIds);
    },
    [products, setSelectedProductIds]
  );

  const allSelected =
    selectedProductIds.length > 0 &&
    selectedProductIds.length === products.length;

  const indeterminate =
    selectedProductIds.length > 0 &&
    selectedProductIds.length < products.length;

  return (
    <div>
      <ClayManagementToolbar>
        <ClayManagementToolbar.ItemList expand>
          <ClayManagementToolbar.Item>
            <ClayCheckbox
              checked={allSelected}
              containerProps={{ className: "mx-3" }}
              indeterminate={indeterminate}
              onChange={() => handleSelectAll(allSelected)}
              title="Select All"
            />
          </ClayManagementToolbar.Item>
          <ClayManagementToolbar.Item>
            <ClayButton
              className="mr-4"
              displayType="primary"
              onClick={() => handleDelete()}
            >
              {`Delete ${selectedProductIds.length} Products`}
            </ClayButton>
          </ClayManagementToolbar.Item>
          <ClayManagementToolbar.Item>
            <span>{executeStatus}</span>
          </ClayManagementToolbar.Item>

          <li className="flex-grow-1"></li>

          <ClayManagementToolbar.Search showMobile>
            <ClayInput.Group>
              <ClayInput.GroupItem>
                <ClayInput
                  aria-label="Search"
                  className="form-control"
                  onChange={(e) => setSearch(e.currentTarget.value)}
                  placeholder="Filter By..."
                  type="text"
                  value={search}
                />
              </ClayInput.GroupItem>
            </ClayInput.Group>
          </ClayManagementToolbar.Search>

          <ClayManagementToolbar.Item>
            <ClayPaginationBarWithBasicItems
              activeDelta={delta}
              activePage={activePage}
              deltas={DELTAS}
              ellipsisBuffer={3}
              onDeltaChange={setDelta}
              onPageChange={setActivePage}
              spritemap={spritemap}
              totalItems={totalProducts}
            />
          </ClayManagementToolbar.Item>
        </ClayManagementToolbar.ItemList>
      </ClayManagementToolbar>

      <LoadingContainer loading={loading}>
        <ProductList
          onSelect={(productId) => handleProductSelect(productId)}
          products={products}
          selectedProductIds={selectedProductIds}
        />
      </LoadingContainer>
    </div>
  );
}

export default App;
