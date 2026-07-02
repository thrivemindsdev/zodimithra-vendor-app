import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function QuickActions() {
  const navigate = useNavigate();
  const actions = [
    {
      id: 'quick-action-chat',
      label: 'chat',
      className: 'w-[62px] h-[81px]',
      labelColor: 'text-[#8E4A4A]',
      icon: (
        <svg 
          className="transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] group-hover:-translate-y-1 group-hover:scale-[1.04] group-hover:shadow-[0px_6px_14px_rgba(142,74,74,0.22)] group-active:translate-y-0 group-active:scale-[0.96] group-active:shadow-[0px_2px_4px_rgba(0,0,0,0.1)] rounded-[20px]" 
          width="62" 
          height="60" 
          viewBox="0 0 62 60" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="62" height="60" rx="20" fill="#F5EFEF" />
          <path 
            className="transition-transform duration-300 group-hover:scale-108"
            d="M26.1944 32.0675H33.5833V31.0135H26.1944V32.0675ZM26.1944 28.9054H37.8056V27.8513H26.1944V28.9054ZM26.1944 25.7432H37.8056V24.6892H26.1944V25.7432ZM22.5 39V22.7033C22.5 22.2178 22.6629 21.8127 22.9887 21.488C23.3145 21.1634 23.7199 21.0007 24.2047 21H39.7953C40.2808 21 40.6862 21.1627 41.0113 21.488C41.3364 21.8134 41.4993 22.2185 41.5 22.7033V34.0544C41.5 34.5393 41.3371 34.9444 41.0113 35.2697C40.6855 35.5951 40.2801 35.7574 39.7953 35.7567H25.7479L22.5 39ZM25.2972 34.7026H39.7953C39.9571 34.7026 40.106 34.6352 40.2418 34.5003C40.3776 34.3653 40.4451 34.2167 40.4444 34.0544V22.7023C40.4444 22.5407 40.3769 22.392 40.2418 22.2564C40.1067 22.1208 39.9578 22.0533 39.7953 22.054H24.2047C24.0429 22.054 23.894 22.1215 23.7582 22.2564C23.6224 22.3913 23.5549 22.54 23.5556 22.7023V36.4366L25.2972 34.7026Z" 
            fill="#8E4A4A" 
          />
        </svg>
      )
    },
    {
      id: 'quick-action-bookings',
      label: 'Bookings',
      className: 'w-[77.33px] h-[81px]',
      labelColor: 'text-[#CF9914]',
      icon: (
        <svg 
          className="transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] group-hover:-translate-y-1 group-hover:scale-[1.04] group-hover:shadow-[0px_6px_14px_rgba(207,153,20,0.22)] group-hover:animate-calendar-jiggle group-active:translate-y-0 group-active:scale-[0.96] group-active:shadow-[0px_2px_4px_rgba(0,0,0,0.1)] rounded-[20px]" 
          width="62" 
          height="60" 
          viewBox="0 0 62 60" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="62" height="60" rx="20" fill="#F9F5EB" />
          <path d="M21 30C21 26.229 21 24.343 22.172 23.172C23.344 22.001 25.229 22 29 22H33C36.771 22 38.657 22 39.828 23.172C40.999 24.344 41 26.229 41 30V32C41 35.771 41 37.657 39.828 38.828C38.656 39.999 36.771 40 33 40H29C25.229 40 23.343 40 22.172 38.828C21.001 37.656 21 35.771 21 32V30Z" stroke="#CF9914" strokeWidth="1.5" />
          <path opacity="0.5" d="M26 22V20.5M36 22V20.5M21.5 27H40.5" stroke="#CF9914" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M37 35C37 35.2652 36.8946 35.5196 36.7071 35.7071C36.5196 35.8946 36.2652 36 36 36C35.7348 36 35.4804 35.8946 35.2929 35.7071C35.1054 35.5196 35 35.2652 35 35C35 34.7348 35.1054 34.4804 35.2929 34.2929C35.4804 34.1054 35.7348 34 36 34C36.2652 34 36.5196 34.1054 36.7071 34.2929C36.8946 34.4804 37 34.7348 37 35ZM37 31C37 31.2652 36.8946 31.5196 36.7071 31.7071C36.5196 31.8946 36.2652 32 36 32C35.7348 32 35.4804 31.8946 35.2929 31.7071C35.1054 31.5196 35 31.2652 35 31C35 30.7348 35.1054 30.4804 35.2929 30.2929C35.4804 30.1054 35.7348 30 36 30C36.2652 30 36.5196 30.1054 36.7071 30.2929C36.8946 30.4804 37 30.7348 37 31ZM32 35C32 35.2652 31.8946 35.5196 31.7071 35.7071C31.5196 35.8946 31.2652 36 31 36C30.7348 36 30.4804 35.8946 30.2929 35.7071C30.1054 35.5196 30 35.2652 30 35C30 34.7348 30.1054 34.4804 30.2929 34.2929C30.4804 34.1054 30.7348 34 31 34C31.2652 34 31.5196 34.1054 31.7071 34.2929C31.8946 34.4804 32 34.7348 32 35ZM32 31C32 31.2652 31.8946 31.5196 31.7071 31.7071C31.5196 31.8946 31.2652 32 31 32C30.7348 32 30.4804 31.8946 30.2929 31.7071C30.1054 31.5196 30 31.2652 30 31C30 30.7348 30.1054 30.4804 30.2929 30.2929C30.4804 30.1054 30.7348 30 31 30C31.2652 30 31.5196 30.1054 31.7071 30.2929C31.8946 30.4804 32 30.7348 32 31ZM27 35C27 35.2652 26.8946 35.5196 26.7071 35.7071C26.5196 35.8946 26.2652 36 26 36C25.7348 36 25.4804 35.8946 25.2929 35.7071C25.1054 35.5196 25 35.2652 25 35C25 34.7348 25.1054 34.4804 25.2929 34.2929C25.4804 34.1054 25.7348 34 26 34C26.2652 34 26.5196 34.1054 26.7071 34.2929C26.8946 34.4804 27 34.7348 27 35ZM27 31C27 31.2652 26.8946 31.5196 26.7071 31.7071C26.5196 31.8946 26.2652 32 26 32C25.7348 32 25.4804 31.8946 25.2929 31.7071C25.1054 31.5196 25 31.2652 25 31C25 30.7348 25.1054 30.4804 25.2929 30.2929C25.4804 30.1054 25.7348 30 26 30C26.2652 30 26.5196 30.1054 26.7071 30.2929C26.8946 30.4804 27 30.7348 27 31Z" fill="#CF9914" />
        </svg>
      )
    },
    {
      id: 'quick-action-earnings',
      label: 'Earnings',
      className: 'w-[78px] h-[81px]',
      labelColor: 'text-[#C09FB4]',
      icon: (
        <svg 
          className="transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] group-hover:-translate-y-1 group-hover:scale-[1.04] group-hover:shadow-[0px_6px_14px_rgba(192,159,180,0.35)] group-active:translate-y-0 group-active:scale-[0.96] group-active:shadow-[0px_2px_4px_rgba(0,0,0,0.1)] rounded-[20px]" 
          width="62" 
          height="60" 
          viewBox="0 0 62 60" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="62" height="60" rx="20" fill="#F5F0FE" />
          <path 
            className="transition-transform duration-300 group-hover:scale-108"
            d="M27.2727 20.5H40L38.7273 22.5H34.5782C35.1891 23.08 35.6473 23.76 35.9145 24.5H40L38.7273 26.5H40L38.7273 26.5H36.1818C36.0237 27.7466 35.3343 28.9147 34.2254 29.815C33.1166 30.7153 31.6533 31.2949 30.0727 31.46V31.5H29.1818L36.8182 38.5H33.6364L26 31.5V29.5H29.1818C31.4218 29.5 33.28 28.2 33.5855 26.5H26L27.2727 24.5H33.2036C32.4909 23.32 30.9636 22.5 29.1818 22.5H26L27.2727 20.5Z" 
            fill="#685360" 
          />
        </svg>
      )
    },
    {
      id: 'quick-action-tools',
      label: 'Tools',
      className: 'w-[64.67px] h-[81px]',
      labelColor: 'text-[#1D8A57]',
      icon: (
        <svg 
          className="transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] group-hover:-translate-y-1 group-hover:scale-[1.04] group-hover:shadow-[0px_6px_14px_rgba(29,138,87,0.22)] group-hover:rotate-[15deg] group-active:translate-y-0 group-active:scale-[0.96] group-active:shadow-[0px_2px_4px_rgba(0,0,0,0.1)] rounded-[20px]" 
          width="65" 
          height="60" 
          viewBox="0 0 65 60" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="64.6667" height="60" rx="20" fill="#EBF4F0" />
          <path d="M33.3334 29L38.3334 24" stroke="#1D8A57" strokeWidth="1.5" />
          <path d="M39.3334 25L37.3334 23L39.8334 21.5L40.8334 22.5L39.3334 25ZM24.3584 26.975C23.8783 26.4953 23.548 25.8864 23.4077 25.2224C23.2675 24.5583 23.3233 23.8679 23.5684 23.235L24.9904 24.657H26.9904V22.657L25.5684 21.235C26.2013 20.9893 26.892 20.9331 27.5563 21.073C28.2207 21.213 28.83 21.5431 29.31 22.0232C29.79 22.5034 30.12 23.1127 30.2598 23.7771C30.3996 24.4414 30.3432 25.1321 30.0974 25.765L36.5674 32.236C37.2002 31.9902 37.8909 31.9338 38.5553 32.0736C39.2197 32.2134 39.829 32.5434 40.3091 33.0234C40.7893 33.5034 41.1194 34.1127 41.2594 34.777C41.3993 35.4414 41.343 36.1321 41.0974 36.765L39.6764 35.343H37.6764V37.343L39.0984 38.765C38.4656 39.0106 37.7751 39.067 37.1109 38.9272C36.4467 38.7874 35.8374 38.4575 35.3573 37.9777C34.8773 37.4978 34.5471 36.8887 34.407 36.2246C34.2669 35.5604 34.323 34.8699 34.5684 34.237L28.0964 27.765C27.4638 28.0097 26.7737 28.0653 26.1101 27.925C25.4465 27.7848 24.8379 27.4547 24.3584 26.975Z" stroke="#1D8A57" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M32.5363 32.5L26.9323 38.104C26.8069 38.2296 26.658 38.3293 26.494 38.3973C26.3301 38.4653 26.1543 38.5003 25.9768 38.5003C25.7993 38.5003 25.6236 38.4653 25.4596 38.3973C25.2956 38.3293 25.1467 38.2296 25.0213 38.104L24.2293 37.312C24.1037 37.1866 24.004 37.0377 23.936 36.8737C23.868 36.7098 23.833 36.534 23.833 36.3565C23.833 36.179 23.868 36.0032 23.936 35.8393C24.004 35.6753 24.1037 35.5264 24.2293 35.401L29.8333 29.797" stroke="#1D8A57" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      )
    }
  ];

  return (
    <div className="flex flex-col items-start p-[10px_12px_10px] md:p-[15px_20px_15px] gap-[15px] w-[calc(100%-32px)] md:w-full max-w-[411px] md:max-w-none h-[137px] mx-auto md:mx-0 mt-4 md:mt-0 box-border bg-white shadow-[0px_4px_14px_rgba(0,0,0,0.08),_0px_2px_10px_0.2px_rgba(0,0,0,0.15)] rounded-[18px] z-10 relative max-[380px]:p-[10px_8px_10px] max-[380px]:h-auto max-[380px]:min-h-[137px]">
      <h2 className="w-full h-6 m-0 px-1 box-border font-['Sofia_Sans'] font-semibold text-[20px] leading-6 flex items-center text-[#424040]">
        Quick Actions
      </h2>
      <div className="flex flex-row justify-center items-center p-0 gap-7 w-full h-[81px] box-border max-[380px]:gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            id={action.id}
            className={`group flex flex-col justify-center items-center p-0 bg-transparent border-0 cursor-pointer outline-none box-border ${action.className}`}
            onClick={() => {
              if (action.id === 'quick-action-chat') {
                navigate('/messages');
              } else if (action.id === 'quick-action-earnings') {
                navigate('/earnings');
              } else if (action.id === 'quick-action-tools') {
                navigate('/tools');
              } else if (action.id === 'quick-action-bookings') {
                navigate('/bookings');
              } else {
                console.log(`${action.label} clicked`);
              }
            }}
            aria-label={action.label}
          >
            {action.icon}
            <span className={`h-[21px] mt-1 font-['Poppins'] font-semibold text-[13.5px] leading-[21px] flex items-center justify-center text-center transition-all duration-200 group-hover:-translate-y-0.5 ${action.labelColor}`}>
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
