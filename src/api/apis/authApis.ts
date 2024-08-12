import { axiosInstance } from '../instance';
import {
  EmailSignupFormType,
  SocialSignupFormType,
} from '@/types/request/authRequestTypes';

export const postSigninForm = (formData: FormData) => {
  return axiosInstance.post('/login', formData);
};

export const postEmailSignupForm = (data: EmailSignupFormType) => {
  return axiosInstance.post('/signup', data, {
    headers: {
      'Content-Type': 'mulitpart/form-data',
    },
  });
};

export const getEmailDupCheck = (email: string) => {
  return axiosInstance.get(`/check-email?email=${email}`);
};

export const getNickNameDupCheck = (nickName: string) => {
  return axiosInstance.get(`/check-nickname?nickName=${nickName}`);
};

export const postSocialSignupForm = (data: SocialSignupFormType) => {
  return axiosInstance.post('/social/signup', data);
};

export const getSocialToken = () => {
  return axiosInstance.get('/token', {
    withCredentials: true,
  });
};
