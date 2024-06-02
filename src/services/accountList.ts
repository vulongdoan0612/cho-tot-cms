import { axios } from '@/utils/axios';

export const getUsersCMS = async (access_token_admin: string) => {
  const config: any = {
    method: 'GET',
    url: `/get-users-cms`,
    headers: {
      Authorization: access_token_admin,
    },
  };

  return axios(config);
};

export const getPostsCMS = async (access_token_admin: string) => {
  const config: any = {
    method: 'GET',
    url: `/get-posts-cms`,
    headers: {
      Authorization: access_token_admin,
    },
  };

  return axios(config);
};

export const acceptCensorship = async (access_token_admin: string, data: any) => {
  const config: any = {
    method: 'POST',
    url: `/accept-censorship`,
    headers: {
      Authorization: access_token_admin,
    },
    data: data,
  };

  return axios(config);
};

export const refuseCensorship = async (access_token_admin: string, data: any) => {
  const config: any = {
    method: 'POST',
    url: `/refuse-censorship`,
    headers: {
      Authorization: access_token_admin,
    },
    data: data,
  };

  return axios(config);
};

export const deletePost = async (access_token_admin: string, data: any) => {
  const config: any = {
    method: 'DELETE',
    url: `/delete-post`,
    headers: {
      Authorization: access_token_admin,
    },
    data: data,
  };

  return axios(config);
};

export const deleteUser = async (access_token_admin: string, data: any) => {
  const config: any = {
    method: 'DELETE',
    url: `/delete-user`,
    headers: {
      Authorization: access_token_admin,
    },
    data: data,
  };

  return axios(config);
};
