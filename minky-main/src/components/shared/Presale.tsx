"use client"
import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import * as web3 from '@solana/web3.js';

import { Input } from "@/components/ui/input"

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useToast } from "@/components/ui/use-toast"
import { BASE_URL, fetcher } from '../../../utils/fetcher'
import useSWR from 'swr'
import { calculateTokens } from '../../../utils/helper'
import useSendTokens from '@/contracts/useSendTokens'
import { Shell } from 'lucide-react'
import SliderInfo from '../presale-components/SliderInfo'
import RecieveTokens from '../presale-components/receive-tokens'
import ShowSuccessModal from '../presale-components/show-success';
import ShowErrorModal from '../presale-components/show-error';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const Presale = () => {
  const { data, error, isLoading } = useSWR(`${BASE_URL}/price?ids=SOL`, fetcher)
  const { sendTokens, loading, isOpen, setIsOpen, transactionUrl, errorMessage, success, } = useSendTokens()

  const { connection } = useConnection();
  const { publicKey, sendTransaction, connect, select } = useWallet()
  //@ts-ignore
  const [amount, setAmount] = useState<number >(null)
  const { toast } = useToast()
  const [balance, setBalance] = useState(0);
  const TokenAddress =new web3.PublicKey(`GyVn9eqqZ7X2Xucir4ZhmvUQMN2J6AJJo3Wo7YuVFMTH`)


  const [txSig, setTxSig] = useState('');
 
  const [amountTokens, setAmountTokens] = useState(null)
  //@ts-ignore
  useEffect(() => {
    const getInfo = async () => {
        if (connection && publicKey) {
            const info = await connection.getAccountInfo(publicKey);
            if(info){
              setBalance(info.lamports / web3.LAMPORTS_PER_SOL);
            }  
        }
        
    };
    getInfo();
}, [connection,  publicKey, txSig]);
  const handleWalletConnect = async () => {
  connect()
  }
  const handleTransaction = async () => {
    if (!connection || !publicKey) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Please Connect your wallet and try again",
      })
      return;
    }

    if (amount < 0.01 || amount === 0 || amount === null) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a valid amount. Minimum Purchase is 0.01 SOl",
      })
      return;
    }
    if(balance < amount || balance === 0 || balance === amount ){
      toast({
        variant: "destructive",
        title: "Insufficient Balance",
        description: `Your ${balance} Sol is currently insufficent. Top up your balance to purchase presale`,
      })
      return
    }
    const transaction = new web3.Transaction();
    const instruction = web3.SystemProgram.transfer({
      fromPubkey: publicKey,
      lamports: amount * web3.LAMPORTS_PER_SOL,
      toPubkey: TokenAddress,
    });

    transaction.add(instruction);
   
    try {
      const signature = await sendTransaction(transaction, connection);
      setTxSig(signature)
      sendTokens(amountTokens, publicKey)
      toast({
        title: "Deposit Successful!",
        description: "Your token will appear in your wallet soon..",
      })
    }
    catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Transaction Failed",
        description: "There was a problem with your request.",
      })
    }
  };
 

  const handleAmountChange = (e: any) => {
    const tokens = calculateTokens(e.target.value, data?.data?.SOL.price);
    //@ts-ignore
    setAmountTokens(tokens)
    setAmount(e.target.value)
  }

  return (
    <div
      className="   px-[20px] md:px-[50px]   max-w-[500px] w-full allocateShadow
     space-y-8 rounded-[50px] border-[#00FF4F] border"
    >
      <SliderInfo walletBalance={balance} />

      <div className="flex gap-4 items-center">
        <div className="flex flex-col space-y-4">
          <h3 className="text-white">Pay:</h3>
          <div className="w-full relative">
            <Input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0"
            />
          </div>
        </div>
        <RecieveTokens amountTokens={amountTokens} />
      </div>
      {!connection || !publicKey ? (
        <div className='w-full min-w-[200px] sm:min-w-[400px]'>
          <WalletMultiButton
            style={{
              backgroundColor: "#00FF4F",
              color: "black",
              width: "100%",
              borderRadius: "20px",
              // maxWidth: "400px",
              textAlign: "center",
            }}
            className=" !w-[200px]  rounded-[20px] bg hover:bg-[#161b19] transition-all duration-200"
          >
            <span className="font-bold changa-one-regular w-full text-center">
              Connect Wallet
            </span>
          </WalletMultiButton>
        </div>
      ) : (
        <Button
          disabled={loading}
          onClick={handleTransaction}
          className="w-full flex gap-4 bg-brand-cyan text-black
          regular
          py-6"
        >
          {loading && <Shell color="#00F5FF" className="animate-spin" />}
          Buy CALA
        </Button>
      )}

      {isOpen && success && (
        <ShowSuccessModal
          url={transactionUrl}
          amountTokens={amountTokens}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      )}

      {isOpen && errorMessage && (
        <ShowErrorModal isOpen={isOpen} setIsOpen={setIsOpen} />
      )}
    </div>
  );
}

export default Presale