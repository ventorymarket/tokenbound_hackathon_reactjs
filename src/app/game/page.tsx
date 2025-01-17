'use client';

import IconPower from '@/assets/icons/IconPower';
import CustomButton from '@/components/custom/CustomButton';
import CustomImage from '@/components/custom/CustomImage';
import ListNftSkeleton from '@/components/custom/CustomSkeleton/ListNftSkeleton';
import NftSkeleton from '@/components/custom/CustomSkeleton/NftSkeleton';
import ModalTbaDetail from '@/components/modal/ModalTbaDetail';
import { useStore } from '@/context/store';
import { login } from '@/fetching/client/game';
import { fetchUserTbaList } from '@/fetching/client/user';
import useMounted from '@/hook/useMounted';
import { formatDecimal, tbaPowerBg } from '@/utils';
import { toastError } from '@/utils/toast';
import { useAccount, useSignTypedData } from '@starknet-react/core';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ArraySignatureType, typedData, TypedData } from 'starknet';

let page = 2;

const Game = () => {
  const [openModalTbaDetail, setOpenModalTbaDetail] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<any>(null);
  const router = useRouter();
  const { setTbaLoginData, setAccessToken, accessToken, tbaLoginData } =
    useStore();
  const { address } = useAccount();
  const { signTypedDataAsync } = useSignTypedData({ primaryType: 'Validate' });
  const [loading, setLoading] = useState(false);
  const { isMounted } = useMounted();
  const [userUnlistedTba, setUserUnlistedTba] = useState<any>();

  const LIMIT = 8;

  useEffect(() => {
    if (accessToken && tbaLoginData) {
      router.push(`/game/play`);
    }
  }, [accessToken, tbaLoginData]);

  useEffect(() => {
    if (!isMounted || !address) return;
    getUserTbaList();
  }, [isMounted, address]);

  const getUserTbaList = async () => {
    page = 2;
    fetchUserTbaList({ address, page: 1, limit: LIMIT, listing: false })
      .then((res) => {
        setUserUnlistedTba(res.data);
        window.scrollTo(0, 0);
      })
      .catch((err) => {
        toastError('Get Unlisted Tba failed');
        console.log(err);
      });
  };

  const getMoreUserTbaList = async () => {
    fetchUserTbaList({ address, page, limit: LIMIT, listing: false })
      .then((res) => {
        const data = res?.data;
        setUserUnlistedTba((prev: any) => ({
          pagination: data?.pagination,
          data: [...prev?.data, ...data?.data],
        }));
        page++;
      })
      .catch((err) => {
        toastError('Get Unlisted Tba failed');
        console.log(err);
      });
  };

  const onLoginGame = async (item: any) => {
    if (!address) return;

    setLoading(true);
    try {
      // Sign argentX Address
      const signature = await handleSign();
      console.log(signature);

      // Login
      const loginData = await login({
        address: address,
        tba_address: item?.tba_address,
        signature: signature[0],
        sign_data: signData,
        token_id: item?.token_id,
      });

      setAccessToken(loginData?.data?.data?.token);
      setTbaLoginData(item);

      // Join Game
      router.push(`/game/play`);
    } catch (error) {
      toastError('Login Game failed, try reconnect your wallet!');
      setLoading(false);
      console.log('error', error);
    }
  };

  const handleSign = async () => {
    const typedDataValidate: TypedData = signData;
    const msgHash = typedData.getMessageHash(typedDataValidate, address as any);
    const arraySignature = (await signTypedDataAsync(
      typedDataValidate
    )) as ArraySignatureType;
    let signatureS = '';
    return [arraySignature, signatureS, msgHash];
  };

  const signData = {
    types: {
      StarkNetDomain: [
        { name: 'name', type: 'felt' },
        { name: 'version', type: 'felt' },
        { name: 'chainId', type: 'felt' },
      ],
      Validate: [
        { name: 'signer', type: 'felt' },
        { name: 'expire', type: 'string' },
      ],
    },
    primaryType: 'Validate',
    domain: {
      name: 'BlingBling',
      version: '1',
      chainId: '0x534e5f5345504f4c4941',
    },
    message: {
      signer: address,
      expire: Date.now() + 1000 * 60 * 5,
    },
  };

  return (
    <div className=''>
      <ModalTbaDetail
        open={openModalTbaDetail}
        onCancel={() => {
          setOpenModalTbaDetail(false);
        }}
        showBuy={false}
        selectedNFT={selectedNFT}
      />
      <div className='py-[5rem] sm:py-[8rem] layout-container font-glancyr flex flex-col items-center'>
        <h1 className='text-[32px] sm:text-[48px] text-center'>
          Select your Token-Bound Account to Play game!
        </h1>
        <div className='w-full  mt-[40px]'>
          {address ? (
            userUnlistedTba !== undefined ? (
              userUnlistedTba?.data?.length > 0 ? (
                <InfiniteScroll
                  dataLength={userUnlistedTba?.data?.length}
                  next={getMoreUserTbaList}
                  hasMore={userUnlistedTba?.pagination?.hasMore}
                  loader={<NftSkeleton />}
                  className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[16px]'
                  // scrollThreshold={-10}
                >
                  {userUnlistedTba?.data?.map((item: any, index: any) => (
                    <div key={item?._id || index}>
                      <div className='p-[12px] rounded-2xl bg-[#fff] text-[#031F68]'>
                        <div
                          className=' group cursor-pointer'
                          onClick={() => {
                            setSelectedNFT(item);
                            setOpenModalTbaDetail(true);
                          }}
                        >
                          <div
                            style={{
                              background: tbaPowerBg(item?.power),
                            }}
                            className='aspect-square w-full relative overflow-hidden rounded-2xl'
                          >
                            <CustomImage
                              src={item?.tba_image}
                              fill
                              alt='Nft'
                              className='object-cover w-full rounded-2xl group-hover:scale-110 transition-all duration-500 ease-in-out'
                            />
                          </div>
                          <div className='my-[16px]'>
                            <p className='text-[18px] uppercase font-[400] truncate'>
                              {item?.tba_name || 'NFT Name'}
                            </p>
                            <div className='grid sm:grid-cols-2 max-sm:gap-[0.5rem] p-[12px] bg-[#FBFDEB] rounded-2xl mt-[12px] '>
                              <div className='font-[300] text-[16px] max-sm:flex flex-col items-center'>
                                <p className='text-[#546678]'>Power</p>
                                <p className='text-[18px] font-[400] mt-[4px]'>
                                  <div className='flex items-center gap-[6px]'>
                                    <IconPower />
                                    {item?.power}
                                  </div>
                                </p>
                              </div>
                              <div className='font-[300] text-[16px] max-sm:flex flex-col items-center'>
                                <p className='text-[#546678] '>Total Points</p>
                                <p className='text-[18px] font-[400] mt-[4px]'>
                                  <div className='flex items-center gap-[6px]'>
                                    {formatDecimal(Number(item?.point))}
                                  </div>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <CustomButton
                          onClick={() => {
                            if (!address) return;
                            setSelectedNFT(item);
                            onLoginGame(item);
                          }}
                          className='btn-primary w-full'
                          loading={selectedNFT?._id === item?._id && loading}
                        >
                          Login Game
                        </CustomButton>
                      </div>
                    </div>
                  ))}
                </InfiniteScroll>
              ) : (
                <div className='text-[#DCFC36]'>No Data!</div>
              )
            ) : (
              <ListNftSkeleton />
            )
          ) : (
            <div className='text-[#DCFC36]'>Please Connect your wallet!</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Game;
