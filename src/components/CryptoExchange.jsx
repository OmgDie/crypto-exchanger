import React, { useEffect, useState } from 'react';
import DropDown from './DropDown';
import {
  getAvailableCurrencies,
  getEstimatedAmount,
  getMinimalAmount,
} from '../api/index';
import InputEffereum from './InputEffereum';
import { ExchangeIcon } from './IconsExchange';
import { Button } from 'antd';
import styles from '../styles/CryptoExchange.module.scss';
import '../styles/InputEffereum.module.scss';

const CryptoExchange = () => {
  useEffect(() => {
    getAvailableCurrencies()
      .then(response => {
        setAvailableCurrencies(response.data);
        getMinimalAmount({
          fromCurrency: response.data[0].ticker,
          toCurrency: response.data[1].ticker,
        })
          .then(minimalAmount => {
            updateInputValue('fromValue', minimalAmount.data.minAmount);
          })
          .catch(err => setError(err.response.data.message));
        setFromCurrency(response.data[0]);
        setToCurrency(response.data[1]);
      })
      .catch(err => setError(err.response.data.message));
  }, []);

  const [error, setError] = useState('');
  const [fromCurrency, setFromCurrency] = useState(null);
  const [toCurrency, setToCurrency] = useState(null);
  const [inputValue, setInputValue] = useState({
    fromValue: '',
    toValue: '',
  });
  const [availableCurrencies, setAvailableCurrencies] = useState([]);

  const calculateEstimatedAmount = value => {
    setError('');
    getEstimatedAmount({
      fromCurrency: fromCurrency.ticker,
      toCurrency: toCurrency.ticker,
      amount: value,
    })
      .then(estimatedAmount => {
        updateInputValue('toValue', estimatedAmount.data.estimatedAmount);
      })
      .catch(err => setError(err.response.data.message));
  };

  useEffect(() => {
    if (inputValue.fromValue) {
      if (error === 'Out of min amount') updateInputValue('toValue', '-');
      else {
        calculateEstimatedAmount(Number(inputValue.fromValue));
      }
    }
  }, [inputValue.fromValue]);

  const updateMinimalAmount = (currencyType, item) => {
    if (currencyType === 'fromValue') {
      setFromCurrency(item);
      getMinimalAmount({
        fromCurrency: item.ticker,
        toCurrency: toCurrency.ticker,
      })
        .then(minimalAmount => {
          updateInputValue('fromValue', minimalAmount.data.minAmount);
        })
        .catch(err => setError(err.response.data.message));
    } else {
      setToCurrency(item);
      calculateEstimatedAmount(Number(inputValue.fromValue));
    }
  };

  const changeCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    updateInputValue('fromValue', inputValue.toValue);
  };

  const onChangeValue = (value, objKey) => {
    updateInputValue(objKey, value);
  };

  const updateInputValue = (key, value) => {
    setInputValue(prevState => ({ ...prevState, [key]: value }));
  };
  return (
    <div className={styles.Exchange}>
      <div className={styles.StyledTitle}>
        Crypto Exchange
        <span>Exchange fast and easy</span>
      </div>
      <div className={styles.StyledDropDown}>
        <DropDown
          updateCurrentExchange={updateMinimalAmount}
          objKey={'fromValue'}
          currentExchange={fromCurrency}
          exchanges={availableCurrencies}
          onChangeValue={onChangeValue}
          value={inputValue.fromValue}
        />

        <button onClick={changeCurrencies}>
          <ExchangeIcon />
        </button>
        <DropDown
          updateCurrentExchange={updateMinimalAmount}
          objKey={'toValue'}
          currentExchange={toCurrency}
          exchanges={availableCurrencies}
          onChangeValue={onChangeValue}
          value={inputValue.toValue}
        />
      </div>
      Your Ethereum address
      <div className={styles.StyledEthereum}>
        <InputEffereum />
        <div className={styles.ErrorWrapper}>
          <Button type="primary">Exchange</Button>
          {error && (
            <div className={styles.error}>This pair is disabled now</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CryptoExchange;
