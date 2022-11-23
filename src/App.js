import { useRef, useState } from "react";

const App = () => {
  const [itemData, setItemData] = useState([
    {
      id: 1,
      name: '러블리 하트케이크 | 일반, 초코색, 원형',
      amount: 1,
      price: 40000,
      checked: false,
      totalPrice: 40000,
    },
    {
      id: 2,
      name: '티아라 케이크 | 1호',
      amount: 1,
      price: 35000,
      checked: false,
      totalPrice: 35000,
    }
  ]);

  const checkboxAllItemRef = useRef();
  const allItemRef = useRef(0);
  const totalItemRef = useRef(0);

  // ==================== 선택시 가격 동기화 ====================
  const selectedPrice = (index) => {
    const tmpData = [...itemData];

    tmpData[index].checked = !tmpData[index].checked;

    if (tmpData[index].checked) {
      allItemRef.current += tmpData[index].totalPrice;
    } else {
      allItemRef.current -= tmpData[index].totalPrice;
    }

    const hasFalseData = tmpData.map((item) => item.checked);

    if (hasFalseData.includes(false)) {
      checkboxAllItemRef.current.checked = false;
    }

    totalItemRef.current = allItemRef.current === 0 ? 0 : allItemRef.current + 3000;

    setItemData(tmpData);
  };

  // ==================== 전체 선택, 가격 동기화 ====================
  const onClickAllItemPrice = () => {
    const tmpData = [...itemData];

    if (checkboxAllItemRef.current.checked) {
      tmpData.forEach((item, index, array) => {
        if (array[index].checked) {
          allItemRef.current += 0;
        } else {
          array[index].checked = !array[index].checked;
          allItemRef.current += array[index].totalPrice;
        }
      });

      totalItemRef.current = allItemRef.current + 3000;
    } else {
      tmpData.forEach((item, index, array) => {
        array[index].checked = !array[index].checked;
      });

      allItemRef.current = 0;
      totalItemRef.current = 0;
    }

    setItemData(tmpData);
  };

  // ==================== 상품 삭제 ====================
  const deleteLine = (e) => {
    e.preventDefault();

    const tmpData = itemData.filter((item) => !item.checked);
    const selectedData = itemData.filter((item) => item.checked);

    if (itemData.length === 0) {
      alert('상품이 없습니다.');
    }

    if (itemData.length > 0 && selectedData.length === 0) {
      alert('선택된 상품이 없습니다.');
    }

    allItemRef.current = 0;
    totalItemRef.current = 0;
    checkboxAllItemRef.current.checked = false;

    setItemData(tmpData);
  };

  // ==================== 개수 변경, 가격 동기화 ====================
  const changeAmount = (e, index) => {
    const { direction } = e.target.dataset;

    const tmpData = [...itemData];

    tmpData[index].amount += +direction;
    tmpData[index].totalPrice += tmpData[index].price * +direction;

    if (tmpData[index].checked) {
      allItemRef.current += tmpData[index].price * +direction;
      totalItemRef.current = allItemRef.current + 3000;
    }

    setItemData(tmpData);
  };

  // ==================== 선택 상품 주문 ====================
  const selectedItemOrder = (e) => {
    e.preventDefault();

    const selectedItemData = itemData.filter((item) => item.checked);

    if (selectedItemData.length !== 0) {
      // eslint-disable-next-line no-restricted-globals
      location.pathname = '/order/';
    } else {
      alert('상품을 선택해주세요.');
    }
  };

  // ==================== 전체 상품 주문 ====================
  const allItemOrder = (e) => {
    e.preventDefault();

    if (itemData.length !== 0) {
      // eslint-disable-next-line no-restricted-globals
      location.pathname = '/order/';
    } else {
      alert('장바구니가 비었습니다.');
    }
  };

  return (
    <>
      <div className="cart">
        <div className="header-line">
          <div className="line-header w25">
            <input
              type="checkbox"
              id="all-item"
              onClick={onClickAllItemPrice}
              ref={checkboxAllItemRef}
            />
          </div>
          <div className="line-header">상품/옵션 정보</div>
          <div className="line-header w150">수량</div>
          <div className="line-header w150">상품금액</div>
        </div>
        {itemData.length === 0 && (
          <div className='line'>
            <div className='line-content'>장바구니가 비어있습니다.</div>
          </div>
        )}
        {itemData.map((item, index) => (
          <div key={item.id} className="line">
            <div className="line-content w25">
              <input
                type="checkbox"
                name="item[]"
                checked={item.checked}
                onChange={() => selectedPrice(index)}
              />
            </div>

            <div className="line-content">
              {item.name}
            </div>
            <div className="line-content w150 amount">
              {itemData[index].amount !== 1 && (
                <button
                  type='button'
                  className='decrease'
                  data-direction='-1'
                  onClick={(e) => changeAmount(e, index)}
                >
                  -
                </button>
              )}
              {item.amount}개
              <button
                type='button'
                className='increase'
                data-direction='1'
                onClick={(e) => changeAmount(e, index)}
              >
                +
              </button>
            </div>
            <div className="line-content w150 price">
              {item.totalPrice.toLocaleString()}원
            </div>
          </div>
        ))}
      </div>
      <div id="cash">
        <p>
          상품 총 금액 <i className="fas fa-caret-right" />
          <span className="all-item">{allItemRef.current.toLocaleString()}원</span>
        </p>
        <p>
          배송비 <i className="fas fa-caret-right" />
          <span className="delivery">3,000원</span>
        </p>
      </div>

      <div id="all">
        <p>
          합계 <i className="fas fa-caret-right" />
          <span className="total">{totalItemRef.current.toLocaleString()}원</span>
        </p>
      </div>

      <div className="buttons">
        {itemData.length !== 0 && (
          <input
            type="button"
            className="seleted-delete"
            value="선택 항목 삭제"
            onClick={deleteLine}
          />
        )}
        <input type="submit" value="선택 항목 주문" onClick={selectedItemOrder} />
        <input type="submit" value="모든 항목 주문" onClick={allItemOrder} />
      </div>
    </>
  );
};

export default App;
