import React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import logo from '../images/logo.png';
import { Colors } from '../components/utils/_var';
import { Alertbox, Backdrop, InputField } from '../components/UserComponents';
import CloseButton from '../components/CloseButton';

export const SignupView = styled.div`
  box-sizing: border-box;
  width: 19rem;
  height: 22rem;
  background-color: ${Colors.black};
  position: relative;
  text-align: center;
  padding-top: 0.7rem;
  .logo {
    width: 7.5rem;
    margin: 0.7rem auto 1rem;
  }
`;

export const SignUpInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const SignUpButton = styled.button`
  margin: 0.2rem 0.4rem 0rem;
  cursor: pointer;
  font-size: 0.9rem;
  background-color: ${Colors.green};
  width: 13.2rem;
  height: 2.5rem;
  border-radius: 7px;
  border: none;
  color: white;
  :hover {
    background-color: ${Colors.darkGreen};
  }
`;

type SignupProp = {
  handleModal: () => void;
  handleMessage: (a: string) => void;
  handleNotice: (a: boolean) => void;
};

function Signup({ handleModal, handleMessage, handleNotice }: SignupProp) {
  const [userInfo, setUserInfo] = useState({
    userId: '',
    password: ''
  });

  const [checkId, setCheckId] = useState('');
  const [checkPassword, setCheckPassword] = useState(false);
  const [checkRetypePassword, setCheckRetypePassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleInputValue = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, [key]: e.target.value });
  };

  const isValidId = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regExpSpec = /^[A-Za-z0-9]+$/;
    if (e.target.value.search(/\s/) !== -1) {
      setCheckId('space');
    } else if (!regExpSpec.test(e.target.value)) {
      setCheckId('english');
    } else if (e.target.value.length < 6 || e.target.value.length > 12) {
      setCheckId('length');
    } else {
      setCheckId('ok');
    }
  };

  const isValidPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,10}$/;
    if (regExp.test(e.target.value)) {
      setCheckPassword(true);
    } else {
      setCheckPassword(false);
    }
  };

  const handleCheckPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value !== '' && e.target.value === userInfo.password) {
      setCheckRetypePassword(true);
    } else {
      setCheckRetypePassword(false);
    }
  };

  const inputCheck = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputValue(key)(e);
    if (key === 'password') {
      isValidPassword(e);
    }
    if (key === 'userId') {
      isValidId(e);
    }
  };

  const handleSignupRequest = () => {
    if (userInfo.userId === '' || userInfo.password === '') {
      setErrorMsg('?????? ????????? ????????? ?????????');
    } else if (checkId === 'space') {
      setErrorMsg('???????????? ????????? ???????????? ????????????');
    } else if (checkId === 'english') {
      setErrorMsg('???????????? ??????, ?????? ??????????????? ???????????????');
    } else if (checkId === 'length') {
      setErrorMsg('???????????? 6-12????????????');
    } else if (checkPassword !== true) {
      setErrorMsg('???????????? ????????? ??????????????????');
    } else if (checkRetypePassword !== true) {
      setErrorMsg('??????????????? ???????????? ????????????');
    } else {
      axios
        .post(`${process.env.REACT_APP_API_URL}/signup`, userInfo, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        })
        .then((res) => {
          if (res.status === 201) {
            handleModal();
            handleNotice(true);
            handleMessage('???????????? ??????!');
          }
        })
        .catch((error) => {
          if (error.response.status === 409) {
            setErrorMsg('?????? ????????? ??????????????????');
          } else console.log(error.response.data.message);
        });
    }
  };

  return (
    <Backdrop>
      <SignupView>
        <CloseButton onClick={handleModal} />
        <img className="logo" src={logo} alt="logo" />
        <SignUpInputContainer>
          <InputField onChange={inputCheck('userId')} placeholder="????????? (6-12???)" />
          <InputField
            type="password"
            onChange={inputCheck('password')}
            placeholder="???????????? (??????, ?????? ????????? ??????)"
          />
          <InputField
            type="password"
            onChange={handleCheckPassword}
            placeholder="???????????? ?????????"
          />
        </SignUpInputContainer>
        <SignUpButton onClick={handleSignupRequest}>????????????</SignUpButton>
        <Alertbox>{errorMsg}</Alertbox>
      </SignupView>
    </Backdrop>
  );
}

export default Signup;
