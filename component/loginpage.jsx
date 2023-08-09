/* eslint-disable @next/next/no-img-element */
/* eslint-disable no-shadow */

"use client"

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { parseCookies, setCookie } from 'nookies';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styles from './styles/loginPage.module.scss';

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const validationSchema = Yup.object().shape({
    name: !isLogin && Yup.string().required('使用者名稱為必填項目'),
    email: Yup.string().email('請輸入有效的電子郵件').required('電子郵件為必填項目'),
    password: Yup.string()
    .required('密碼為必填項')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, '密碼需包含大小寫字母和數字，且長度至少八個字符'),
    confirmPassword: !isLogin && Yup.string().oneOf([Yup.ref('password'), null], '密碼不一致'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const trimmedValues = {
        ...values,
        email: values.email.trim(),
        password: values.password.trim(),
        confirmPassword: values.confirmPassword.trim(),
        name: values.name.trim(),
      };
      try {
        let response;
        if (isLogin) {
          response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/signin`,
            {
              provider: 'native',
              email: trimmedValues.email,
              password: trimmedValues.password,
            }
          );
          const accessToken = response.data.data.access_token;
          setCookie(null, 'accessToken', accessToken, { path: '/' });
          const userId = response.data.data.user.id;
          setCookie(null, 'user_id', userId, { path: '/' });
        } else {
          response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/signup`,
            {
              name: trimmedValues.name,
              email: trimmedValues.email,
              password: trimmedValues.password,
            }
          );
        }
        setSubmitting(false);
        router.push('/homepage');
      } catch (error) {
        if (error?.response?.status >= 500) {
          alert('Something\'s wrong. Please try again later or notify our engineering team.');
        } else {
          console.log('Error:', error);
        }
        setSubmitting(false);
      }
    },
  });

  const { values, handleChange, handleSubmit, isSubmitting, errors } = formik;

  const handleModeChange = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className={`${styles.sginupfrom} ${isLogin ? styles.loginWidth : styles.signupWidth}`}>
      <form className={styles.loginSection} onSubmit={handleSubmit}>
        <img className={styles.logoPhoto} src="/image/CanChu.png" alt="Logo" />
        <p className={styles.passtext}>{isLogin ? '會員登入' : '會員註冊'}</p>
        {!isLogin && (
          <div className={styles.nameSection}>
            <label htmlFor="name" className={styles.nameText}>
              使用者名稱
            </label>
            <input
              className={styles.AddnameText}
              type="text"
              id="name"
              placeholder="例: Chou Chou Hu"
              name="name"
              value={values.name}
              onChange={handleChange}
            />
            {errors.name && <div className={styles.error}>{errors.name}</div>}
          </div>
        )}
        <div className={styles.emailSection}>
          <p className={styles.emailText}>電子郵件</p>
          <input
            className={styles.AddemailText}
            type="text"
            name="email"
            value={values.email}
            placeholder="例: shirney@appworks.tw"
            onChange={handleChange}
          />
          {errors.email && <div className={styles.error}>{errors.email}</div>}
        </div>
        <div className={styles.passwordSection}>
          <p className={styles.passText}>密碼</p>
          <input
            className={styles.AddpasswordText}
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
          />
          {errors.password && <div className={styles.error}>{errors.password}</div>}
        </div>
        {!isLogin && (
          <div className={styles.confirmPasswordSection}>
            <p className={styles.confirmPassText}>再次輸入密碼</p>
            <input
              className={styles.AddconfirmPasswordText}
              type="password"
              name="confirmPassword"
              value={values.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <div className={styles.error}>{errors.confirmPassword}</div>}
          </div>
        )}
        <button className={styles.purpleButton} type="submit" disabled={isSubmitting}>
          {isLogin ? '登入' : '註冊'}
        </button>
        <p className={styles.purpleLinkText}>
          {isLogin ? '尚未成為會員？' : '已經是會員了？'}
          <button type="button" className={styles.purpleLink} onClick={handleModeChange}>
            {isLogin ? '會員註冊' : '會員登入'}
          </button>
        </p>
      </form>
      <div className={styles.rightSection}></div>
      <p className={styles.CanChuAbout}>
        關於我們 · 隱私權條款 · Cookie 條款 · © 2023 CanChu, Inc.
      </p>
    </div>
  );
}

export default LoginPage;