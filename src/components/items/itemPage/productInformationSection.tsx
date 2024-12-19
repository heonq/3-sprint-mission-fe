'use client';

import Image from 'next/image';
import ActionMenu from '@/components/community/actionMenu/actionMenu';
import TagsContainer from '../registration/tagsContainer';
import Profile from '@/components/common/profile/profile';
import ProfileIcon from '@/public/icons/profile_icon.png';
import LikeButton from '@/components/common/likeButton/likeButton';
import { useProductQuery } from '@/hooks/products/useProductQuery';
import Modal from '@/components/modal/modal';
import { useErrorHandling } from '@/hooks/useErrorHandling';
import { useDeleteProductMutation } from '@/hooks/products/useDeleteProductMutation';
import { useState } from 'react';
import { useMe } from '@/hooks/useMe';
import { useRouter } from 'next/navigation';

export default function ProductInformationSection({ id }: { id: string }) {
  const { data: product } = useProductQuery({
    id,
  });
  const router = useRouter();
  const { data: me } = useMe();

  const { modalOpen, setModalOpen, errorMessage, handleError } =
    useErrorHandling();

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const { mutate } = useDeleteProductMutation({
    onMutateFn: () => setConfirmModalOpen(false),
    onErrorFn: handleError,
  });

  const onEditFn = () => {
    if (me?.id !== product?.id)
      return handleError('본인의 상품만 수정할 수 있습니다.');
    router.push(`/items/${product?.id}/edit`);
  };

  return (
    product && (
      <>
        <section className='flex w-full gap-6'>
          <div className='w-[343px] md:w-[343px] xl:w-[486px] aspect-square relative flex-shrink-0'>
            <Image
              src={product.images[0]}
              alt={`${product.name} 이미지`}
              className='object-cover'
              fill
            />
          </div>
          <div className='w-full flex flex-col justify-between gap-4 border-b'>
            <div className='flex gap-4 flex-col'>
              <div className='flex flex-col border-b gap-4 pb-4'>
                <div className='flex justify-between items-center'>
                  <span className='text-2xl font-semibold'>{product.name}</span>
                  <ActionMenu
                    id={product.id.toString()}
                    onDeleteButtonClick={() => setConfirmModalOpen(true)}
                    onEditButtonClick={onEditFn}
                  />
                </div>
                <span className='font-semibold text-[40px]'>{`${product.price.toLocaleString()}원`}</span>
              </div>
              <div className='flex flex-col gap-4'>
                <h2 className='font-semibold'>상품 소개</h2>
                <div>{product.description}</div>
              </div>
              <span className='font-semibold'>상품 태그</span>
              <TagsContainer
                variant='display'
                tags={product.tags}
              />
            </div>
            <div className='flex justify-between items-center '>
              <Profile
                layout='vertical'
                variant='date'
                nickname={product.ownerNickname}
                createdAt={product.createdAt}
                profileIcon={ProfileIcon}
                iconSize={40}
              />
              <LikeButton
                count={product.favoriteCount}
                liked={product.isFavorite}
                id={product.id.toString()}
              />
            </div>
          </div>
        </section>
        <Modal
          variant='error'
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          message={errorMessage}
        />
        <Modal
          variant='confirm'
          modalOpen={confirmModalOpen}
          setModalOpen={setConfirmModalOpen}
          message='정말로 상품을 삭제하시겠어요?'
          onConfirm={() => mutate(product.id.toString())}
        />
      </>
    )
  );
}