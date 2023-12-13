import React, { useState, useEffect, useRef } from 'react';
import { Dropdown as DropdownLib, Input } from 'antd';
import { ExchangeArrowDown, ExchangeCross } from './IconsExchange';
import { FixedSizeList } from 'react-window';
import styles from '../styles/DropDown.module.scss';

const DropDown = ({
  value,
  updateCurrentExchange,
  onChangeValue,
  objKey,
  exchanges,
  currentExchange,
}) => {
  const divRef = useRef(null);

  const [availableExchanges, setAvailableExchanges] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const [isHovered, setIsHovered] = useState(false);

  const inlineStyles = {
    input: { borderRadius: 0, borderTopLeftRadius: 5, borderTopRightRadius: 5 },
    menuItem: {
      width: '88%',
      background: isHovered ? '#EAF1F7' : 'none',
      padding: '13px 16px',
      height: 48,
      display: 'flex',
      alignItems: 'center',
    },
    h1: {
      fontSize: 16,
      marginLeft: 12,
      textTransform: 'uppercase',
      fontWeight: '400',
      color: '#282828',
    },
    subtitle: {
      fontSize: 16,
      marginLeft: 16,
      fontWeight: '400',
      color: '#80A2B6',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  };

  const chooseExchange = item => {
    updateCurrentExchange(objKey, item);
    setOpenedDropdown(false);
  };

  const renderMenuItem = ({ index, style }) => {
    const item = availableExchanges[index];
    return (
      <div
        key={index}
        onClick={() => chooseExchange(item)}
        style={{ ...style, ...inlineStyles.menuItem }}
      >
        <img src={item.image} alt={item.name} />
        <h1 style={inlineStyles.h1}>{item.ticker}</h1>
        <h2 style={inlineStyles.subtitle}>{item.name}</h2>
      </div>
    );
  };

  useEffect(() => setAvailableExchanges(exchanges), [exchanges]);

  useEffect(() => {
    if (inputValue === '') {
      setAvailableExchanges(exchanges);
      return;
    }
    setAvailableExchanges(
      exchanges.filter(
        exchange =>
          exchange.name.includes(inputValue) ||
          exchange.ticker.includes(inputValue),
      ),
    );
  }, [inputValue]);

  const [isOpenedDropdown, setOpenedDropdown] = useState(false);

  const changeDropdownState = () => {
    setOpenedDropdown(!isOpenedDropdown);
  };

  return (
    <div
      ref={divRef}
      className={
        isOpenedDropdown
          ? styles.ExchangeDropdownActive
          : styles.ExchangeDropdown
      }
    >
      <Input
        style={inlineStyles.input}
        onClick={e => e.stopPropagation()}
        readOnly={objKey === 'toValue' && !isOpenedDropdown}
        placeholder={isOpenedDropdown ? 'Search' : undefined}
        onChange={e =>
          isOpenedDropdown
            ? setInputValue(e.currentTarget.value)
            : onChangeValue(e.currentTarget.value, objKey)
        }
        value={isOpenedDropdown ? inputValue : value}
      />
      {isOpenedDropdown && (
        <button onClick={() => setInputValue('')}>
          <ExchangeCross />
        </button>
      )}
      <DropdownLib
        placement="bottomLeft"
        open={isOpenedDropdown}
        onOpenChange={changeDropdownState}
        trigger={['click']}
        className={styles.buttonSwitcher}
        overlay={
          <div>
            <FixedSizeList
              className={styles.dropdownMenu}
              height={480}
              itemCount={availableExchanges.length}
              itemSize={48}
              width={'100%'}
            >
              {renderMenuItem}
            </FixedSizeList>
          </div>
        }
      >
        <a onClick={e => changeDropdownState}>
          {!isOpenedDropdown && (
            <div className={styles.space}>
              <img src={currentExchange?.image} alt={currentExchange?.name} />
              <p>{currentExchange?.ticker.toUpperCase()}</p>
              <ExchangeArrowDown />
            </div>
          )}
        </a>
      </DropdownLib>
    </div>
  );
};

export default DropDown;
