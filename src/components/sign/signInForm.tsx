'use client';

import { useForm } from 'react-hook-form';
import { SignInFormData } from './types';
import Image from 'next/image';
import logo from '@/public/images/common/logo.png';
import CommonInputSection from './commonInputSection';
import CommonBtn from '../common/commonBtn/commonBtn';
import SocialLogin from './socialLogin';
import LoginLink from './loginLink';

export default function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    mode: 'onBlur',
  });

  const onSubmit = (data: SignInFormData) => {
    console.log(data);
  };

  return (
    <form
      className='w-full flex flex-col items-center mt-[56px] md:mt-[158px] xl:mt-[170px]'
      onSubmit={handleSubmit(onSubmit)}
    >
      <Image
        src={logo}
        alt='로고 이미지'
        width={396}
      />
      <CommonInputSection<SignInFormData>
        register={register}
        errors={errors}
        label='이메일'
        type='email'
        name='email'
        placeholder='이메일을 입력해주세요'
        validation={{
          required: '이메일을 입력해주세요',
          pattern: {
            value: /^\S+@\S+$/i,
            message: '잘못된 이메일입니다',
          },
        }}
      />
      <CommonInputSection<SignInFormData>
        register={register}
        errors={errors}
        label='비밀번호'
        type='password'
        name='password'
        placeholder='비밀번호를 입력해주세요'
        validation={{
          required: '비밀번호를 입력해주세요',
          minLength: {
            value: 8,
            message: '비밀번호를 8자 이상 입력해주세요',
          },
        }}
      />
      <CommonBtn className='w-full rounded-full mb-6 h-[56px]'>
        회원가입
      </CommonBtn>
      <SocialLogin />
      <LoginLink variant='signIn' />
    </form>
  );
}
