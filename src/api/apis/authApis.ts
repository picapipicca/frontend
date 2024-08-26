import { axiosInstance } from '../instance';
import {
  EmailSignupFormType,
  SocialSignupFormType,
} from '@/types/request/authRequestTypes';

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

export const getSocialToken = () => {
  return axiosInstance.get(`/token`, {
    withCredentials: true,
  });
};
