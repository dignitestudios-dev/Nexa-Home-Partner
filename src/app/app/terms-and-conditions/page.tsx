"use client";

import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
});

const termsParagraphs = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc non eleifend odio, suscipit aliquam erat. Quisque eu fermentum tortor. Nunc efficitur dictum finibus. Integer lorem lacus, sodales ut interdum vitae, tempus non mi. Sed mollis vehicula nulla id iaculis. In hac habitasse platea dictumst. Vivamus eget tellus sollicitudin, aliquam ligula quis, euismod massa. Morbi iaculis sit amet metus ut condimentum. Maecenas scelerisque lacus sodales posuere sollicitudin. Vivamus accumsan purus mauris, a placerat sapien porta vitae.",
  "Proin finibus orci neque, nec sollicitudin lorem auctor sit amet. Integer lacinia massa auctor augue facilisis feugiat. Sed nisl metus, faucibus quis mauris non, pellentesque tincidunt eros. Cras vulputate ornare lectus quis accumsan. Nam laoreet, eros dapibus semper gravida, libero dolor imperdiet augue, eu posuere urna velit id nibh. Proin purus mauris.",
  "Ut eget velit blandit, tempus ex non, varius leo. Maecenas ultricies, arcu in volutpat consectetur, eros augue maximus lectus, nec congue odio velit sit amet ipsum. Nulla ultricies, ante sit amet tempor finibus, lectus est consectetur dui, ac iaculis purus augue a justo.",
  "Suspendisse tristique ipsum vitae nunc commodo, non eleifend nisi pretium. Nulla facilisi. Curabitur id ultricies leo. Quisque eleifend accumsan sem, sit amet hendrerit neque dictum vel. Nullam nec velit sed ligula bibendum dictum. Phasellus volutpat efficitur quam id posuere. Suspendisse at velit sollicitudin, vestibulum eros nec, hendrerit lectus. Praesent placerat ex urna, eget sagittis metus cursus in.",
  "Pellentesque a arcu ac mauris lacinia luctus aliquet eget dolor. Nullam malesuada fringilla interdum. Vestibulum lectus urna, ornare in viverra eu, vestibulum ac dui. Morbi porta arcu in orci pellentesque, volutpat luctus enim venenatis. Sed vehicula, massa nec hendrerit placerat, massa tellus tempus tortor, in faucibus nulla nibh quis diam. Sed venenatis, ligula eu imperdiet facilisis, nunc est egestas nisl, id molestie ex mi a diam. Donec sed lorem eleifend, pellentesque.",
];

export default function TermsAndConditionsPage() {
  return (
    <div className={`${plusJakarta.className} min-h-full`}>
      <div className="mb-6">
        <h1 className="text-[30px] leading-[45px] font-[600] text-[#1A1A1A] mb-6">
          Terms and Conditions
        </h1>
      </div>

      <section className="w-full bg-white rounded-[24px] shadow-sm p-6 md:p-8 lg:p-10">
        <div className="space-y-8 max-w-[1060px]">
          {termsParagraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-[16px] leading-[26px] font-normal text-[#5C5C5C]"
            >
              {paragraph}
            </p>
          ))}
        </div>

      </section>
    </div>
  );
}

