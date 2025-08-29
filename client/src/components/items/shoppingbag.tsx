import Image from 'next/image'
import React from 'react'

function Shoppingbag() {
  return (
    <div>
        <div className='p-8 mb-6'>
            <p className='text-lg font-bold'>SHOPPING BAG</p>
        </div>

        <div className='p-8 border border-b border-t border-black mb-6 flex justify-between'>
            <div className='flex gap-6'>
                <Image width={276} height={255} src="/shopingBagBG" alt="" />
                <div>
                    <p className='text-2xl'>FASHION</p>
                    <p><span className='text-[#5B5252]'>size:</span> xxl</p>
                    <p><span className='text-[#5B5252]'>size:</span> <span className='w-6 h-6 bg-[#CAB490]'></span></p>
                    <p><span className='text-[#5B5252]'>qty:</span> 1</p>
                </div>
            </div>
            <div className='flex flex-row justify-between ' >
                <Image width={20} height={20} src={'/icons/close.png'} alt='' />
                <p>Price: </p>
            </div>
        </div>

        <div className='p-12' >
            <p className='text-2xl'>TOTAL:</p>
        </div>
    </div>
  )
}

export default Shoppingbag