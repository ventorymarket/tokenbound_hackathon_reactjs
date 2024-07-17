'use client';

import CustomButton from '@/components/custom/CustomButton';
import CustomImage from '@/components/custom/CustomImage';
import NftSkeleton from '@/components/custom/CustomSkeleton/NftSkeleton';
import ModalTbaDetail from '@/components/modal/ModalTbaDetail';
import { useStore } from '@/context/store';
import { login } from '@/fetching/client/game';
import { formatDecimal } from '@/utils';
import { toastError } from '@/utils/toast';
import { useAccount, useSignTypedData } from '@starknet-react/core';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { ArraySignatureType, typedData, TypedData } from 'starknet';

const Play = () => {
  const [openModalTbaDetail, setOpenModalTbaDetail] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<any>(null);
  const router = useRouter();
  const {
    profileData,
    getProfile,
    setTbaLoginData,
    setAccessToken,
    accessToken,
    tbaLoginData,
  } = useStore();
  const { address } = useAccount();
  const { signTypedDataAsync } = useSignTypedData({ primaryType: 'Validate' });
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState<any>([]);

  useEffect(() => {
    if (accessToken && tbaLoginData) {
      router.push(`/game/menu`);
    }
  }, [accessToken, tbaLoginData]);

  useEffect(() => {
    const newProfile = profileData?.filter(
      (item: any) => item?.listing === false
    );
    setFilteredData(newProfile);
  }, [profileData]);

  useEffect(() => {
    if (!address) return;

    getProfile(address);
  }, [address]);

  const onLoginGame = async (item: any) => {
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
      console.log(loginData);

      setAccessToken(loginData?.data?.data?.token);

      // Set Tba Login Data
      setTbaLoginData(item);

      // Join Game
      router.push(`/game/menu`);
    } catch (error) {
      toastError('Login Game failed');
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
        <h1 className='text-[32px] sm:text-[48px]'>
          Select your Token-Bound Account to Play game!
        </h1>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-[40px] gap-[16px] w-full'>
          {address ? (
            filteredData !== undefined ? (
              filteredData?.length > 0 ? (
                filteredData?.map((item: any, index: any) => (
                  <div key={item?._id || index}>
                    <div className='p-[12px] rounded-2xl border border-[#EFFEA3] bg-[#FBFDEB] text-[#031F68]'>
                      <div
                        className=' group cursor-pointer'
                        onClick={() => {
                          setSelectedNFT(item);
                          setOpenModalTbaDetail(true);
                        }}
                      >
                        <div className='aspect-square w-full relative overflow-hidden rounded-2xl'>
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
                          <p className='text-[16px] font-[300] text-[#546678] mt-[0.5rem]'>
                            Total Points:
                            <span className='text-[#031F68] text-[18px] font-[400] ml-[0.5rem]'>
                              {formatDecimal(Number(item?.point))}
                            </span>
                          </p>
                        </div>
                      </div>

                      <CustomButton
                        onClick={() => {
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
                ))
              ) : (
                <div className='text-[#DCFC36]'>No Data!</div>
              )
            ) : (
              [...new Array(4)].map((_, index) => <NftSkeleton key={index} />)
            )
          ) : (
            <div className='text-[#DCFC36]'>Please Connect your wallet!</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Play;
