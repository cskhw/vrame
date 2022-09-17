import type { Ref } from "vue";

export interface IIComponentSpinner {
  onSpin: () => void;
  offSpin: () => void;
  isOpen: boolean;
  /** 스피너 세팅 함수, 사용할 때 스피너의 ref가 created에선 아직 할당되지 않았으므로
   * () => spinner.value.setSpinner(anyFunction)() 와 같이 함수로 한 번 감싸주는 형태로 사용해야 한다.
   * @param {F extends (...args: any[]) => any} fn 세팅시 실행해 줄 함수
   * @param {string} style 스피너 배경 스타일 opacity: 불투명, translucent: 반투명
   * @param {Ref<boolean>} status disabled와 같은 상태 ref
   * @returns {any} fn의 리턴값
   */
  setSpinner: <F extends (...args: any[]) => any>(
    fn: F,
    style: "opacity" | "translucent" = "opacity",
    status?: Ref<boolean>
  ) => F;
}
