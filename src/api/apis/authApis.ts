import { InternalAxiosRequestConfig } from 'axios';
import { axiosInstance } from '../instance';
import {
  ConsentFormType,
  EmailSignupFormType,
  SocialSignupFormType,
} from '@/types/request/authRequestTypes';

interface ICustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  noInterceptors?: boolean;
}

export const postSigninForm = (formData: FormData) => {
  return axiosInstance.post('/login', formData, {
    headers: {
      'Content-Type': 'mulitpart/form-data',
    },
  });
};

export const postEmailSignupForm = (data: EmailSignupFormType) => {
  return axiosInstance.post('/signup', data);
};

export const getEmailDupCheck = (email: string) => {
  return axiosInstance.get(`/check-email?email=${email}`);
};

export const getNickNameDupCheck = (nickName: string) => {
  return axiosInstance.get(`/check-nickname?nickName=${nickName}`);
};

export const postSocialSignupForm = (
  data: SocialSignupFormType,
  token: string
) => {
  return axiosInstance.post('/social/signup', data, {
    headers: {
      Authorization: token,
    },
  });
};

export const postRenewAccessToken = () => {
  return axiosInstance.post(`/reissue`, {}, {
    noInterceptors: true,
  } as ICustomAxiosRequestConfig);
};

export const getTermsAgreement = async (required: boolean | 'all') => {
  const query = required === 'all' ? 'TRUE,FALSE' : required ? 'TRUE' : 'FALSE';

  const { data } = await axiosInstance.get(
    `/terms-conditions?required=${query}`
  );

  return data;
};

export const postTermsAgreement = (data: ConsentFormType) => {
  return axiosInstance.post('/terms-conditions/user', data);
};
