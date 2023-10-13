import React from "react";

export default function index() {
  return (
    <div className="bg-white px-4 py-5">
      <div className="flex justify-between pb-1 pt-2">
        <div className="bg-[#5ECFAD] p-1 rounded-[20px] w-[76px] h-[27px] flex justify-between items-center pr-2 pl-0">
          <img src="/test/group3.png" alt="" />
          <img src="/test/video1.png" alt="" />
        </div>
        <div className="relative pr-1">
          <img src="/test/notification.png" alt="" />
          <span className="w-[7px] h-[7px] bg-[#FB3D3D] absolute right-[7px] top-1.5 rounded-full"></span>
        </div>
      </div>
      <div className="rounded-[20px] h-[22px] border border-[#E6E6E6] flex justify-center items-center w-[100px] text-[12px] mt-1">
        Live Streaming
      </div>
      <div className="overflow-hidden rounded-[20px] w-full mt-2 relative">
        <img
          src="/test/image.png"
          alt=""
          className="scale-120 mint-h-[268px] h-full object-cover object-center "
        />
        <div className="bg-[#252836] flex justify-end absolute py-3 bottom-0 w-full px-4">
          <div className="flex gap-6">
            <img
              src="/test/VolumeUp.png"
              alt=""
              className="h-[20px] w-[20px]"
            />
            <img src="/test/Filter.png" alt="" className="h-[20px] w-[20px]" />
            <img
              src="/test/Category.png"
              alt=""
              className="h-[20px] w-[20px]"
            />
          </div>
        </div>
        <img
          src="/test/focusPoint.png"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pb-[40px] w-[150px]"
          alt=""
        />
      </div>
      <div className="mt-3 flex justify-between">
        <div className="w-[30%] rounded-[20px] h-[22px] justify-between px-4 flex items-center text-[9px] text-[#5B7D76] bg-[#EDF7DD]">
          <span>Calmness</span>
          <span>0.21</span>
        </div>
        <div className="w-[30%] rounded-[20px] h-[22px] justify-between px-4 flex items-center text-[9px] text-[#5B7D76] bg-[#D7F2BF]">
          <span>INTEREST</span>
          <span>0.45</span>
        </div>
        <div className="w-[30%] rounded-[20px] h-[22px] justify-between px-4 flex items-center text-[9px] text-[#5B7D76] bg-[#E9FACE]">
          <span>AMUSEMENT</span>
          <span>0.32</span>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex gap-4">
          <img src="/test/Event.png" alt="" />
          <span className="text-[18px] font-bold my-auto">LVENT lOG</span>
        </div>
        <div className="mt-3 bg-[#edf7dda8] rounded-[20px] p-6 text-[#5B7D76] text-[11px] cs-shadow">
          <div className="flex justify-between">
            <span>Eye BLINKED</span>
            <span>0.234567S</span>
          </div>
          <div className="flex justify-between">
            <span>ASLEEP DETECTED BY EYE</span>
            <span>1.87976S</span>
          </div>
          <div className="flex justify-between">
            <span>ASLEEP DETECTED BY MOTION</span>
            <span>0.789986S</span>
          </div>
          <div className="flex justify-between">
            <span>AWAKE DETECTED BY MOTION</span>
            <span>0.23432S</span>
          </div>
          <div className="flex justify-between">
            <span>ACDEFG DETECTED BY ZXCVB</span>
            <span>0.876567S</span>
          </div>
        </div>
      </div>

      <div className="mt-3 bg-[#fefffca8] rounded-[20px] p-6 text-[#5B7D76] text-[12px] cs-shadow">
        <div className="flex justify-between my-0.5">
          <span className="uppercase w-[40%]">calmness</span>
          <div className="w-[60%] my-auto h-[5.4px] bg-[#dfe4e9] rounded-[10px]">
            <div className="bg-[#8AC5F2] rounded-[10px] w-[40%] h-[5.4px]"></div>
          </div>
        </div>
        <div className="flex justify-between my-0.5">
          <span className="uppercase w-[40%]">joy</span>
          <div className="w-[60%] my-auto h-[5.4px] bg-[#dfe4e9] rounded-[10px]">
            <div className="bg-[#8AC5F2] rounded-[10px] w-[40%] h-[5.4px]"></div>
          </div>
        </div>
        <div className="flex justify-between my-0.5">
          <span className="uppercase w-[40%]">amusement</span>
          <div className="w-[60%] my-auto h-[5.4px] bg-[#dfe4e9] rounded-[10px]">
            <div className="bg-[#8AC5F2] rounded-[10px] w-[40%] h-[5.4px]"></div>
          </div>
        </div>
        <div className="flex justify-between my-0.5">
          <span className="uppercase w-[40%]">anger</span>
          <div className="w-[60%] my-auto h-[5.4px] bg-[#dfe4e9] rounded-[10px]">
            <div className="bg-[#8AC5F2] rounded-[10px] w-[40%] h-[5.4px]"></div>
          </div>
        </div>
        <div className="flex justify-between my-0.5">
          <span className="uppercase w-[40%]">confusion</span>
          <div className="w-[60%] my-auto h-[5.4px] bg-[#dfe4e9] rounded-[10px]">
            <div className="bg-[#8AC5F2] rounded-[10px] w-[20%] h-[5.4px]"></div>
          </div>
        </div>
        <div className="flex justify-between my-0.5">
          <span className="uppercase w-[40%]">disgust</span>
          <div className="w-[60%] my-auto h-[5.4px] bg-[#dfe4e9] rounded-[10px]">
            <div className="bg-[#8AC5F2] rounded-[10px] w-[80%] h-[5.4px]"></div>
          </div>
        </div>
        <div className="flex justify-between my-0.5">
          <span className="uppercase w-[40%]">sadness</span>
          <div className="w-[60%] my-auto h-[5.4px] bg-[#dfe4e9] rounded-[10px]">
            <div className="bg-[#8AC5F2] rounded-[10px] w-[30%] h-[5.4px]"></div>
          </div>
        </div>
        <div className="flex justify-between my-0.5">
          <span className="uppercase w-[40%]">horror</span>
          <div className="w-[60%] my-auto h-[5.4px] bg-[#dfe4e9] rounded-[10px]">
            <div className="bg-[#8AC5F2] rounded-[10px] w-[40%] h-[5.4px]"></div>
          </div>
        </div>
        <div className="flex justify-between my-0.5">
          <span className="uppercase w-[40%]">surprise</span>
          <div className="w-[60%] my-auto h-[5.4px] bg-[#dfe4e9] rounded-[10px]">
            <div className="bg-[#8AC5F2] rounded-[10px] w-[80%] h-[5.4px]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
