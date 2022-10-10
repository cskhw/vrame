<template>
  <div
    class="claims d-flex flex-column"
    :style="{
      backgroundColor: stores.ts.isDarkmode
        ? stores.ts.darkmodePalette.backgroundColor
        : '',
      border: stores.ts.isDarkmode ? stores.ts.darkmodePalette.border : '',
      height: $route.path.includes('wtab') ? '100%' : 'calc(100% - 0.5rem)',
    }"
    style="min-width: 17.5rem"
    ref="claimsRef"
    :draggable="isComponentDrag"
    @dragstart="dragStart($event)"
    @dragend="dragEnd($event)"
  >
    <!-- 리드온리 헤더 -->
    <div
      v-if="isReadonlyWindow"
      class="d-flex align-center justify-center"
      style="height: 2.25rem; min-height: 2.25rem; max-height: 2.25rem"
      :style="{
        color: Util.getColor(stores, 'SECONDARY_TEXT'),
        backgroundColor: Util.getColor(stores, 'SECONDARY'),
        fontWeight: 'bold',
      }"
    >
      {{ Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/READONLY") }}
    </div>

    <!-- 청구범위 영역 헤더 시작 -->
    <div class="claims-header d-flex justify-space-between ma-3" v-init-claims>
      <div class="d-flex align-center">
        <!-- 드래그 핸들 -->
        <IconBtn
          v-if="!isReadonlyWindow"
          class="handle mr-2"
          :icon="mdiReorderVertical"
          color="#9E9E9E"
          @mouseenter="isComponentDrag = true"
          @mouseleave="isComponentDrag = false"
        />
        <IconBtn
          v-else
          class="mr-2"
          :icon="mdiReorderVertical"
          color="#9E9E9E"
        />
        <!-- 영역 타이틀 -->
        <div
          class="text-bold-15-black"
          :style="{
            color: stores.ts.isDarkmode ? stores.ts.darkmodePalette.color : '',
          }"
        >
          {{
            Util.isPCT(stores)
              ? Util.getI18NTxt(stores, "I18N/WORKSPACE/CLAIMS/TITLE_PCT")
              : Util.getI18NTxt(stores, "I18N/WORKSPACE/CLAIMS/TITLE")
          }}
        </div>
        <IconBtn
          class="mt-1 ml-2"
          color="#9e9e9e"
          :icon="mdiMenuDown"
          @mouseover="isHoverTitleDownIcon = true"
          @mouseleave="isHoverTitleDownIcon = false"
          ><div v-if="isHoverTitleDownIcon" class="claims-magition-options">
            <ul>
              <!-- 여러 청구항 추가 -->
              <li
                v-if="
                  !isReadonlyWindow && !workspaceStore.claimWizardModal.isOpen
                "
                class="text-400-14-black justify-start"
                @click="
                  openAddClaimsModal();
                  isHoverTitleDownIcon = false;
                "
              >
                {{
                  Util.getI18NTxt(
                    stores,
                    "I18N/WORKSPACE/CLAIMS/MULTI_CLAIM_ADD"
                  )
                }}
              </li>
              <!-- 여러 청구항 삭제 -->
              <li
                v-if="
                  !isReadonlyWindow && !workspaceStore.claimWizardModal.isOpen
                "
                class="text-400-14-black justify-start"
                @click="
                  openDeleteClaimsModal();
                  isHoverTitleDownIcon = false;
                "
              >
                {{
                  Util.getI18NTxt(
                    stores,
                    "I18N/WORKSPACE/CLAIMS/MULTI_CLAIM_DELETE"
                  )
                }}
              </li>
              <!-- 청구항 트리 보기 -->
              <li
                class="text-400-14-black justify-start"
                @click="
                  openTreeModal();
                  isHoverTitleDownIcon = false;
                "
              >
                {{
                  Util.getI18NTxt(
                    stores,
                    "I18N/WORKSPACE/CLAIMS/VIEW_CLAIM_TREE"
                  )
                }}
              </li>
              <!-- 독립항만 보기/모두보기 -->
              <li
                class="text-400-14-black justify-start"
                @click="
                  onlyIndependentSpinner();
                  isHoverTitleDownIcon = false;
                "
              >
                {{
                  !displayOnlyIndependent
                    ? Util.getI18NTxt(
                        stores,
                        "I18N/WORKSPACE/CLAIMS/ONLY_INDEPENDENT_CLAIMS"
                      )
                    : Util.getI18NTxt(
                        stores,
                        "I18N/WORKSPACE/CLAIMS/SHOW_ALL_CLAIMS"
                      )
                }}
              </li>
              <!-- 모두 접기 -->
              <li
                v-if="!isShowFoldingMenu"
                class="text-400-14-black justify-start"
                @click="
                  foldAllSpinner(false);
                  isHoverTitleDownIcon = false;
                "
              >
                {{ Util.getI18NTxt(stores, "I18N/WORKSPACE/CLAIMS/FOLD_ALL") }}
              </li>
              <!-- 모두 펼치기 -->
              <li
                v-if="!isShowFoldingMenu"
                class="text-400-14-black justify-start"
                @click="
                  foldAllSpinner(true);
                  isHoverTitleDownIcon = false;
                "
              >
                {{
                  Util.getI18NTxt(stores, "I18N/WORKSPACE/CLAIMS/UNFOLD_ALL")
                }}
              </li>
            </ul>
          </div></IconBtn
        >
      </div>
      <div class="d-flex align-center">
        <!-- 모두 접기 -->
        <IconBtn
          v-if="isShowFoldingMenu"
          :icon="mdiArrowCollapseVertical"
          color="#9E9E9E"
          @click="foldAllSpinner(false)"
        />
        <!-- 모두 펼치기 -->
        <IconBtn
          v-if="isShowFoldingMenu"
          :icon="mdiArrowExpandVertical"
          color="#9E9E9E"
          @click="foldAllSpinner(true)"
        />
        <!-- 번호 표시 -->
        <IconBtn class="ml-2" :icon="mdiNumeric" color="#9E9E9E" />
        <CommonSwitch
          v-model="showNumber"
          class="mr-1"
          :toggleColor="Util.getColor(stores, 'PRIMARY')"
          :body-color="rgbToRgba(Util.getColor(stores, 'PRIMARY'), '.4')"
        />
        <IconBtn
          v-if="!isReadonlyWindow"
          :icon="mdiOpenInNew"
          color="#9E9E9E"
          @click="onClickOpenNewTabBtn"
        />
        <IconBtn :icon="mdiClose" color="#9E9E9E" @click="closeArea" />
      </div>
    </div>
    <!-- 청구범위 영역 헤더 끝 -->
    <Divider
      height="0.0625rem"
      :bdColor="stores.ts.isDarkmode ? '#414141' : '#DFDFDF'"
    />

    <!-- 청구항 바디 -->

    <div class="claims-content">
      <!-- 청구항 리스트 영역 시작 -->
      <Draggable
        v-model="workspaceStore.caseData.claims"
        item-key="index"
        handle=".handleClaim"
        group="claimCards"
        :dragOptions="{
          scrollSensitivity: 400,
          forceFallback: true,
        }"
        :move="checkWizard"
        @start="draggableStart"
        @end="draggableEndSpinner"
        @drag.stop=""
        @dragstart.stop=""
        @dragend.stop=""
      >
        <template #item="{ element, index }">
          <div
            :id="'claimCard' + element.claimNumber"
            v-if="element.show"
            class="claim-card"
            @mouseenter="claimHoverIndices[index] = true"
            @mouseleave="claimHoverIndices[index] = false"
            draggable="false"
            :item="element"
            :key="element.claimNumber"
            :style="{
              backgroundColor: claimCardHoverColor(index),
            }"
            @drag="claimDragStart"
            @dragend="claimDragEnd"
          >
            <div class="d-flex justify-space-between pa-3">
              <div class="d-flex align-center">
                <IconBtn
                  v-if="index === 0"
                  color="#9e9e9e"
                  class="mr-2"
                  :icon="mdiPin"
                />
                <!-- 드래그 핸들 -->
                <IconBtn
                  v-else
                  color="#9e9e9e"
                  class="handleClaim mr-2"
                  :icon="mdiReorderHorizontal"
                />
                <!-- 청구항 번호 -->
                <div
                  class="text-bold-14-black"
                  :style="{
                    fontFamily: workspaceStore.fontFamily,
                    fontSize: workspaceStore.fontSize,
                    color:
                      element.type === 'I'
                        ? Util.getColor(stores, 'INDEPENDENT')
                        : stores.ts.isDarkmode
                        ? stores.ts.darkmodePalette.color
                        : '',
                    fontWeight: element.type === 'I' ? 'bold' : 500,
                  }"
                >
                  {{ Util.getI18NTxt(stores, "I18N/WORKSPACE/CLAIMS/CLAIM") }}
                  {{ element.claimNumber }}
                </div>
              </div>
              <div v-if="!isReadonlyWindow" class="d-flex">
                <!-- 편집 버튼 -->
                <v-btn
                  v-if="claimHoverIndices[index]"
                  class="pa-0 px-3 mr-1"
                  flat
                  :style="{
                    color: Util.getColor(stores, 'BUTTON_TEXT'),
                    backgroundColor: claimCardBtnBgColor,
                    height: '1.5rem',
                    fontSize: '0.75rem',
                    minWidth: '2rem',
                  }"
                  @click="openEditClaimModal(element, index)"
                  >{{ Util.getI18NTxt(stores, "I18N/BUTTON/EDIT") }}</v-btn
                >
                <!-- 이동 버튼 -->
                <v-btn
                  v-if="
                    claimHoverIndices[index] &&
                    index !== 0 &&
                    !workspaceStore.claimWizardModal.isOpen
                  "
                  class="pa-0 px-3 mr-1"
                  color="#5c6bc0"
                  flat
                  :style="{
                    color: Util.getColor(stores, 'BUTTON_TEXT'),
                    backgroundColor: claimCardBtnBgColor,
                    height: '1.5rem',
                    fontSize: '0.75rem',
                    minWidth: '2rem',
                  }"
                  @click="openMoveClaimModal(element, index)"
                  >{{ Util.getI18NTxt(stores, "I18N/BUTTON/MOVE") }}</v-btn
                >
                <!-- 삭제 버튼 -->
                <IconBtn
                  v-if="
                    claimHoverIndices[index] &&
                    index !== 0 &&
                    !workspaceStore.claimWizardModal.isOpen
                  "
                  color="grey"
                  :icon="mdiTrashCan"
                  @click="openDeleteClaimModal(element, index)"
                />
                <!-- 영역 접기 -->
                <IconBtn
                  color="grey"
                  :icon="element.fold === false ? mdiChevronUp : mdiChevronDown"
                  @click="foldSpinner(index)"
                />
              </div>
            </div>
            <div
              :style="{
                fontFamily: workspaceStore.fontFamily,
                color: stores.ts.isDarkmode
                  ? stores.ts.darkmodePalette.color
                  : '',
              }"
            >
              <div
                v-if="!element.fold"
                class="text-600-14-black pl-3 pr-3 pb-3"
                style="text-align: justify"
                :style="{
                  textIndent:
                    Util.getSettingValue(
                      stores,
                      'SETTING/EDITOR/AUTO_INDENT'
                    ) === 'Y'
                      ? '2rem'
                      : '0rem',
                  fontSize: workspaceStore.fontSize,
                  lineHeight: Util.getSettingValue(
                    stores,
                    'SETTING/EDITOR/LINE_HEIGHT'
                  ),
                }"
                v-html="makeClaimTxt(element)"
              ></div>
            </div>
            <Divider
              height="0.0625rem"
              :bdColor="
                stores.ts.isDarkmode
                  ? stores.ts.darkmodePalette.border.substring(10)
                  : '#DFDFDF'
              "
            />
          </div>
        </template>
      </Draggable>
      <!-- 청구항 로딩 시작 -->
      <IComponentSpinner ref="claimsSpinner" />
      <!-- 청구항 로딩 끝 -->
      <!-- 청구항 리스트 영역 끝 -->
    </div>
    <!-- 청구항 바디 끝 -->
    <!-- 청구범위 영역 footer 시작 -->
    <div
      v-if="!isReadonlyWindow"
      class="claims-add-btn d-flex justify-center justify-space-evenly align-center"
      :style="{
        backgroundColor: stores.ts.isDarkmode ? '#1e1e1e' : '',
        color: '#5c6bc0',
        borderTop: stores.ts.isDarkmode
          ? stores.ts.darkmodePalette.border
          : '0.0625rem solid #DFDFDF',
      }"
    >
      <!-- 청구항 하나 추가 -->
      <div
        class="d-flex text-bold-14-black"
        style="color: #5c6bc0; cursor: pointer"
        @click="openAddClaimModal"
      >
        <IconBtn
          class="mr-2"
          :color="claimFooterBtnColor"
          :icon="mdiPlusCircle"
        />
        <div :style="{ color: claimFooterBtnColor }">
          {{ Util.getI18NTxt(stores, "I18N/BUTTON/ADD") }}
        </div>
      </div>
      <div></div>
      <!-- 청구항 하나 삽입 -->
      <div
        class="d-flex text-bold-14-black"
        style="color: #5c6bc0; cursor: pointer"
        @click="openSelectInsertPositionModal"
      >
        <IconBtn
          class="mr-2"
          :color="claimFooterBtnColor"
          :icon="mdiArrowRightCircle"
        />
        <div :style="{ color: claimFooterBtnColor }">
          {{ Util.getI18NTxt(stores, "I18N/BUTTON/INSERT") }}
        </div>
      </div>
    </div>
    <!-- 청구범위 영역 footer 끝 -->

    <!-- 모달 영역들 -->
    <teleport to="#modal-area">
      <!-- 여러개 청구항 추가 모달 -->
      <Modal
        ref="addClaimsModal"
        :title="actionModalTitle"
        :description="actionModalDescription"
        buttonType="NY"
        :noTxt="Util.getI18NTxt(stores, 'I18N/BUTTON/CANCEL')"
        :yesTxt="Util.getI18NTxt(stores, 'I18N/BUTTON/ADD')"
        :yesFunc="addClaimsSpinner"
      >
        <div class="mb-4">
          <div class="d-flex mt-4">
            <div
              class="d-flex text-400-14-black align-center mr-2"
              style="width: 3.125rem"
              :style="{ color: themeStore.darkmodeColor }"
            >
              {{
                Util.getI18NTxt(
                  stores,
                  "I18N/WORKSPACE/CLAIMS/MULTI_CLAIM_ADD_NUMBER"
                )
              }}
            </div>
            <TextField
              id="add-count"
              v-model="addCount"
              style="width: 6.25rem"
              :placeholder="addCountPlaceholder"
            />
            <RadioBox
              class="ml-5 mr-1"
              v-model="claimType"
              value="I"
              width="1.5rem"
              height="1.5rem"
              color="#FF499E"
            />
            <div
              class="d-flex align-center mr-4 text-bold-14-black"
              style="color: #ff499e"
            >
              {{
                Util.getI18NTxt(
                  stores,
                  "I18N/WORKSPACE/CLAIMS/CLAIM_EDITOR_MODAL_INDEPENDENT"
                )
              }}
            </div>
            <RadioBox
              class="mr-1"
              v-model="claimType"
              value="D"
              width="1.5rem"
              height="1.5rem"
              color="#5c6bc0"
            />
            <div
              class="d-flex align-center mr-6 text-bold-14-black"
              style="color: #5c6bc0"
            >
              {{
                Util.getI18NTxt(
                  stores,
                  "I18N/WORKSPACE/CLAIMS/CLAIM_EDITOR_MODAL_DEPENDENT"
                )
              }}
            </div>
          </div>
          <!-- 인용항 입력 영역 -->
          <div
            v-if="claimType === 'D'"
            class="d-flex align-center mt-4 mb-4 mr-4"
            style="width: 100%"
          >
            <TextField
              readonly
              v-model="quotationTxt"
              cursor="pointer"
              :placeholder="
                Util.getI18NTxt(
                  stores,
                  'I18N/WORKSPACE/CLAIMS/SELECT_PARENT_CLAIM_MODAL_CONTENT'
                )
              "
              @click="openParentClaimSelectModal"
            />
          </div>
        </div>
        <IComponentSpinner
          ref="addClaimsModalSpinner"
          :container-style="{
            width: 'calc(100% - 2rem)',
          }"
        />
      </Modal>

      <!-- 부모 청구항 선택 모달 -->
      <Modal
        ref="parentClaimSelectModal"
        :title="
          Util.getI18NTxt(
            stores,
            'I18N/WORKSPACE/CLAIMS/SELECT_PARENT_CLAIM_MODAL_HEADER'
          )
        "
        :description="
          Util.getI18NTxt(
            stores,
            'I18N/WORKSPACE/CLAIMS/SELECT_PARENT_CLAIM_MODAL_CONTENT'
          )
        "
        buttonType="NY"
        :noTxt="Util.getI18NTxt(stores, 'I18N/BUTTON/CLOSE')"
        :yesTxt="Util.getI18NTxt(stores, 'I18N/BUTTON/SAVE')"
        :yesFunc="saveParentClaim"
      >
        <div class="d-flex align-center">
          <input
            id="select-all"
            class="mr-2 my-4"
            :style="{ width: '1.125rem', height: '1.125rem' }"
            type="checkbox"
            v-model="selectAllClaimsAsParent"
            @click="selectParentClaim(-1)"
          /><span @click="selectParentClaim(-1)">{{
            Util.getI18NTxt(
              stores,
              "I18N/WORKSPACE/CLAIMS/SELECT_PARENT_CLAIM_MODAL_SELECT_ALL"
            )
          }}</span>
        </div>
        <div class="d-flex flex-wrap" style="width: 25rem">
          <template
            v-for="(item, idx) in workspaceStore.caseData.claims"
            :key="item.no"
          >
            <div
              class="claim-select-btn d-flex justify-center align-center mr-2 mb-2"
              :style="{
                width: '1.875rem',
                height: '1.875rem',
                color: 'white',
                backgroundColor: item.type === 'I' ? '#FF499E' : '#5c6bc0',
                opacity: !selectedClaims[idx] ? '.2' : '1',
                cursor: 'pointer',
              }"
              style="border-radius: 0.3rem"
              @click="selectParentClaim(idx)"
            >
              {{ item.claimNumber }}
            </div>
          </template>
        </div>
      </Modal>

      <!-- 여러개 청구항 삭제 모달 -->
      <Modal
        ref="deleteClaimsModal"
        :title="actionModalTitle"
        :description="actionModalDescription"
        buttonType="NY"
        :noTxt="Util.getI18NTxt(stores, 'I18N/BUTTON/CANCEL')"
        :yesTxt="Util.getI18NTxt(stores, 'I18N/BUTTON/DELETE')"
        :yesFunc="deleteClaimsSpinner"
      >
        <div class="mt-2 mb-4">
          <TextField
            id="delete-target-claims"
            v-model="deteteTargetClaims"
            placeholder="3,5,7-9"
          />
        </div>
        <IComponentSpinner
          ref="deleteClaimsModalSpinner"
          :container-style="{ width: 'calc(100% - 2rem)' }"
        />
      </Modal>

      <!-- 하나의 청구항 삭제 모달 -->
      <Modal
        ref="deleteClaimConfirmModal"
        :title="actionModalTitle"
        :description="actionModalDescription"
        buttonType="NY"
        :noTxt="Util.getI18NTxt(stores, 'I18N/BUTTON/CANCEL')"
        :yesTxt="Util.getI18NTxt(stores, 'I18N/BUTTON/DELETE')"
        :yesFunc="deleteClaimSpinner"
      >
        <IComponentSpinner
          ref="deleteClaimModalSpinner"
          :container-style="{ width: 'calc(100% - 2rem)' }"
        />
      </Modal>

      <!-- 청구항 이동 모달 -->
      <Modal
        ref="moveClaimModal"
        :title="actionModalTitle"
        :description="actionModalDescription"
        buttonType="NY"
        :noTxt="Util.getI18NTxt(stores, 'I18N/BUTTON/CANCEL')"
        :yesTxt="Util.getI18NTxt(stores, 'I18N/BUTTON/MOVE')"
        :yesFunc="moveClaimSpinner"
      >
        <div class="mt-2"></div>
        <div class="d-flex align-center justify-start">
          <div>
            <Select
              class="my-2"
              v-model="claimNumberValue"
              :outline-color="Util.getColor(stores, 'PRIMARY')"
              :optionHoverColor="Util.getColor(stores, 'TINTED')"
              :selectHoverBgColor="Util.getColor(stores, 'TINTED')"
              :style="{ width: '7.5rem', height: '2.5rem' }"
              :selectStyle="{
                fontSize: '0.875rem',
              }"
              :options="claimNumberOptions"
              downIcon
              show-border
            />
          </div>
          <div class="pl-3">
            <TextField
              id="claim-move-position"
              v-if="
                claimNumberValue.value === '직접 입력' ||
                claimNumberValue.value === '直接入力' ||
                claimNumberValue.value === 'Direct input'
              "
              v-model="claimPosition"
              :placeholder="claimNumberPlaceholder"
              :style="{ width: '6.25rem', height: '2.5rem' }"
            />
          </div>
        </div>
      </Modal>

      <!-- 청구항 삽입 모달 -->
      <Modal
        ref="selectInsertPositionModal"
        :title="actionModalTitle"
        :description="actionModalDescription"
        buttonType="NY"
        :noTxt="Util.getI18NTxt(stores, 'I18N/BUTTON/CANCEL')"
        :yesTxt="Util.getI18NTxt(stores, 'I18N/BUTTON/INSERT')"
        :yesFunc="openInsertClaimModal"
      >
        <div class="mt-2"></div>
        <div class="d-flex align-center justify-start">
          <div>
            <Select
              class="my-2"
              v-model="claimNumberValue"
              :outline-color="Util.getColor(stores, 'PRIMARY')"
              :optionHoverColor="Util.getColor(stores, 'TINTED')"
              :selectHoverBgColor="Util.getColor(stores, 'TINTED')"
              :style="{ width: '6.25rem', height: '2.5rem' }"
              :selectStyle="{
                fontSize: '0.875rem',
              }"
              :options="claimNumberOptions"
              downIcon
              show-border
            />
          </div>
          <div class="pl-3">
            <TextField
              id="claim-insert-position"
              v-if="
                claimNumberValue.value === '직접 입력' ||
                claimNumberValue.value === '直接入力' ||
                claimNumberValue.value === 'Direct input'
              "
              v-model="claimPosition"
              :outline-color="Util.getColor(stores, 'PRIMARY')"
              :placeholder="claimNumberPlaceholder"
              :style="{ width: '7.5rem', height: '2.5rem' }"
            />
          </div>
        </div>
      </Modal>

      <!-- 청구항 트리 모달 -->
      <Modal
        ref="claimsTreeModal"
        :title="actionModalTitle"
        buttonType="N"
        :noTxt="Util.getI18NTxt(stores, 'I18N/BUTTON/CLOSE')"
      >
        <JSCharting
          ref="chart"
          :options="chartOptions"
          style="width: 41rem; height: 25rem"
        />
      </Modal>

      <!-- 청구항 작성기 모달 -->
      <ClaimWizardModal
        ref="claimWizardModal"
        v-if="workspaceStore.claimWizardModal.isOpen"
        :left="claimWizardModalLeft"
        :top="118"
        opacityBar
        closeBtn
        v-model:leftDock="isClaimWizardDockLeft"
      />
    </teleport>
  </div>
</template>

<script lang="ts" setup>
import * as Util from "@/assets/javascripts/ipedit_util";
import * as ClaimHandler from "@/assets/javascripts/ipedit_claim_handler";
import { rgbToRgba } from "@/assets/javascripts/utils/css";
import IconBtn from "@/components/common/IconBtn.vue";
import Modal from "@/components/common/modal/Modal.vue";
import Select from "@/components/common/Select.vue";
import RadioBox from "@/components/common/RadioBox.vue";
import CommonSwitch from "@/components/common/Switch.vue";
import TextField from "@/components/common/TextField.vue";
import Divider from "@/components/Divider.vue";
import ClaimWizardModal from "@/components/workspace/modal/ClaimWizardModal.vue";
// 스토어 import
import useAppStore from "@/store/useAppStore";
import useI18NStore from "@/store/useI18NStore";
import useModalStore from "@/store/useModalStore";
import useThemeStore from "@/store/useThemeStore";
import useUserStore from "@/store/useUserStore";
import useWorkspaceStore from "@/store/useWorkspaceStore";
import { useRouter } from "vue-router";
import type { ModalType } from "@/types/modal";
import { CClaimWizardModal } from "@/types/workspace";
import {
  mdiArrowCollapseVertical,
  mdiArrowExpandVertical,
  mdiNumeric,
  mdiClose,
  mdiOpenInNew,
  mdiPlusCircle,
  mdiReorderVertical,
  mdiChevronDown,
  mdiChevronUp,
  mdiMenuDown,
  mdiPin,
  mdiReorderHorizontal,
  mdiTrashCan,
  mdiArrowRightCircle,
} from "@mdi/js";

import { ref, watch, onBeforeMount, onMounted } from "vue";
import Draggable from "vuedraggable";
// jscharting은 jscharting-vue에서 import하고 있으나, 거기에서만 import하면 에러가 발생되어, 여기에서도 한번 더 import해줌
import "jscharting";
import JSCharting, { JSC } from "jscharting-vue";
import type { ClaimData } from "@/types/case";
import { tldexie } from "@/assets/javascripts/dexie";
import tinymce from "tinymce/tinymce";
import { computed } from "@vue/reactivity";
import IComponentSpinner from "@/components/IComponentSpinner.vue";
import type { IIComponentSpinner } from "@/types/component";

const isMounted = ref(false);
const claimsSpinner = ref<IIComponentSpinner | undefined>(undefined);
const addClaimsModalSpinner = ref<IIComponentSpinner | undefined>(undefined);
const deleteClaimModalSpinner = ref<IIComponentSpinner | undefined>(undefined);
const deleteClaimsModalSpinner = ref<IIComponentSpinner | undefined>(undefined);
const tempTargetClaimNumber = ref(0);

// 차트 기본 설정
JSC.defaults({
  // 로컬 모듈 url, public/jsc에 위치
  baseUrl: "/jsc",
  // 콘솔 디버그 모드
  debug: true,
});

// 청구항 헤더 드롭다운 메뉴 플래그
const isHoverTitleDownIcon = ref(false);
const isShowFoldingMenu = ref(false);

function closeArea() {
  if (!isReadonlyWindow.value) {
    workspaceStore.controlAreaShow("claim");
    workspaceStore.initializeToolbar = true;
  } else {
    window.close();
  }
}

const vInitClaims = {
  // 여기서 el은 vIinitClaims가 셋팅되어 있는 div
  updated(el: HTMLElement) {
    let width = el.clientWidth;
    if (width > 300) isShowFoldingMenu.value = true;
    else isShowFoldingMenu.value = false;
  },
};
// 새탭 열기 버튼 클릭 시
function onClickOpenNewTabBtn() {
  localStorage.setItem("tabFrom", "claims");
  window.open(
    "wtab",
    "claims",
    `width=${Math.ceil(window.screen.availWidth / 2)}, height=${
      window.screen.availHeight
    }, menubar=no, status=no, toolbar=no, location=no`
  );
}

// 드래그앤드랍 복구용 청구항 임시 저장
const tempClaims = ref<ClaimData[]>([]);

// 차트 초기화
const chart = ref<JSC.Options>();
// 차트 옵션
// https://jscharting.com/examples/chart-types/organizational/multi-parent/#
const chartOptions = ref<JSC.Options>({
  type: "organizational down",
  legend_visible: false,
  defaultTooltip: {
    asHTML: true,
  },
  series: [
    {
      defaultPoint: {
        label: {
          text: "%name",
          autoWrap: false,
        },
        connectorLine_color: "#1b1a1b",
        annotation: {
          padding: 10,
          corners: ["cut", "cut", "cut", "cut"],
          margin: [10, 10, 10, 10],
        },
        color: "#ffffff",
        tooltip: `<div style='width: 18.75rem; background-color: white; white-space: normal; word-break: break-all;'>
          <div>%body</div><b>%category</b></div>`,
      },
      points: [],
    },
  ],
  toolbar: {
    defaultItem: {
      margin: 5,
      events_click: orientChart,
    },
    items: {
      Left_icon: "system/default/zoom/arrow-left",
      Right_icon: "system/default/zoom/arrow-right",
      Down_icon: "system/default/zoom/arrow-down",
      Up_icon: "system/default/zoom/arrow-up",
    },
  },
});

// 차트 방향 버튼 바꾸는 함수
function orientChart(direction: string) {
  console.log(chart.value);
  if (chart.value) chart.value.options.type = "organizational " + direction;
}

const props = defineProps<{
  modelValue?: boolean;
}>();
const emit = defineEmits(["update:modelValue"]);
const modelValue = ref(props.modelValue);

// 전역 값
const appStore = useAppStore();
const userStore = useUserStore();
const modalStore = useModalStore();
const i18nStore = useI18NStore();
const themeStore = useThemeStore();
const workspaceStore = useWorkspaceStore();

const stores = {
  as: appStore,
  us: userStore,
  ms: modalStore,
  is: i18nStore,
  ts: themeStore,
  ws: workspaceStore,
};

const router = useRouter();

// 청구항 영역 HTML 객체
const claimsRef = ref<HTMLElement>();
// 청구항 마법사 모달 HTML 객체
const claimWizardModal = ref<HTMLElement>();

// 레이아웃
const isComponentDrag = ref(false);

// 청구항 마법사 모달 부분

// 청구항 마법사 모달 left값
const claimWizardModalLeft = ref(0);

// store에 선언된 청구항 마법사 모달 생성
workspaceStore.claimWizardModal = new CClaimWizardModal(
  claimWizardModalLeft.value,
  0
);

const addClaimsModal = ref<ModalType>();
const deleteClaimsModal = ref<ModalType>();
const deleteClaimConfirmModal = ref<ModalType>();
const claimsTreeModal = ref<ModalType>();
const moveClaimModal = ref<ModalType>();
const selectInsertPositionModal = ref<ModalType>();
// 인용청구항 선택 모달
const parentClaimSelectModal = ref<HTMLElement & ModalType>();

// 삭제 대상 청구항들
const deteteTargetClaims = ref<string>("");
// 추가 청구항 개수
const addCount = ref<string>("");
// 추가 청구항 개수 placeholder
const addCountPlaceholder = ref<string>("");
// 추가 청구항 종류
const claimType = ref<string>("I");
// 추가 청구항의 인용항 문구
const quotationTxt = ref<string>("");

// 모달에서 선택된 부모항들
const selectedClaims = ref<boolean[]>([]);
// 모달에서 청구항 모두 선택 변수
const selectAllClaimsAsParent = ref(false);
// 부모항들
const parentArray = ref<number[]>([]);

// 모달 내에 표시될 text 셋팅
const actionModalTitle = ref<string>("");
const actionModalDescription = ref<string>("");

type optionType = {
  text: string;
  value: string;
};

const claimNumberValue = ref({ text: "1", value: "1" });
const claimNumberOptions = ref<optionType[]>([]);
const claimNumberPlaceholder = ref<string>("");
const claimPosition = ref<string>("");

// 청구항 작성기 독 왼쪽모드
const isClaimWizardDockLeft = ref(true);

// 청구항 호버 인덱스
const claimHoverIndices = ref<boolean[]>([]);

// 오직 독립항만 보기 flag
const displayOnlyIndependent = ref<boolean>(false);

// 번호 표시 여부
const showNumber = ref<boolean>(true);

// readonly 모드인지 여부
const isReadonlyWindow = ref(false);
// readonly 모드로 동작해야 하는 경우 셋팅: 새창, trash, archive
if (
  router.currentRoute.value.path.indexOf("wtab") > 0 ||
  workspaceStore.caseMasterData.case_status_code_path ===
    "DR_CASE_STATUS/S77" ||
  workspaceStore.caseMasterData.case_status_code_path === "DR_CASE_STATUS/S99"
) {
  //데이터 편집이 불가능하도록 isReadonlyWindow false 처리
  isReadonlyWindow.value = true;
}

// 마법사 모달 떠 있는지 혹은 새창인지 체크
function checkWizard() {
  if (workspaceStore.claimWizardModal.isOpen) {
    Util.openInfoModal(
      stores,
      Util.getI18NTxt(stores, "I18N/WORKSPACE/CLAIMS/MOVE_ALERT"),
      true
    );

    return false;
  }

  // 새창이면 무조건 false 반환
  if (isReadonlyWindow.value) {
    Util.openInfoModal(
      stores,
      Util.getI18NTxt(
        stores,
        "I18N/WORKSPACE/CLAIMS/MOVE_ALERT_IN_THIS_WINDOW"
      ),
      true
    );

    return false;
  }

  return true;
}

// 드래거블 스타트 이벤트에 변경 전 클레임 리스트 저장하기
function draggableStart(e: Event) {
  tempClaims.value = [];
  tempClaims.value = JSON.parse(JSON.stringify(workspaceStore.caseData.claims));
}

// 드래거블 종료 이벤트에 이동 유효성 판단해서 원복시키거나 이동 처리하기
async function draggableEnd(e: { oldIndex: number; newIndex: number }) {
  const fromNumber = e.oldIndex + 1;
  const toNumber = e.newIndex + 1;
  // console.log(fromNumber, toNumber);
  // console.log(tempClaims.value);

  // 이동 위치로 1항이 입력된 경우
  if (toNumber === 1) {
    Util.openInfoModal(
      stores,
      Util.getI18NTxt(
        stores,
        "I18N/WORKSPACE/CLAIMS/MOVE_CLAIM_MODAL_ERROR_CLAIM1"
      ),
      true
    );
    workspaceStore.caseData.claims = tempClaims.value;
    return;
  }

  // fromNumber와 같은 번호 입력된 경우
  if (fromNumber === toNumber) {
    return;
  }

  // 내가 이동하려는 목적 위치가 내가 인용하고 있는 항보다 작은 경우
  if (toNumber <= Math.max(...tempClaims.value[fromNumber - 1].parentArray)) {
    let maxNumber = Math.max(...tempClaims.value[fromNumber - 1].parentArray);
    let infoModalTxt = Util.getI18NTxt(
      stores,
      "I18N/WORKSPACE/CLAIMS/MOVE_CLAIM_MODAL_ERROR_CLAIM_ORDER"
    );

    infoModalTxt = Util.changeDataInI18NTxt(
      stores,
      infoModalTxt,
      "$NUMBER1$",
      fromNumber + ""
    );
    infoModalTxt = Util.changeDataInI18NTxt(
      stores,
      infoModalTxt,
      "$NUMBER2$",
      maxNumber + ""
    );

    Util.openInfoModal(stores, infoModalTxt, true);

    workspaceStore.caseData.claims = tempClaims.value;
    return;
  }

  // 내가 이동하려는 목적 위치가 나를 인용하는 항보다 뒤인 경우
  let childNumber = -1;

  for (let i = fromNumber; i < tempClaims.value.length; i++) {
    // 각 청구항의 부모 청구항 배열 가져옴
    const parentCombinationArray = ClaimHandler.getParentClaimSet(
      tempClaims.value,
      tempClaims.value[i].claimNumber
    );

    // 부모 청구항 배열 중에 삭제하려는 청구항이 있으면, hasChild를 true로 해서 삭제 막음
    for (let j = 0; j < parentCombinationArray.length; j++) {
      if (parentCombinationArray[j].includes(fromNumber)) {
        childNumber = i + 1;
        break;
      }
    }

    if (childNumber !== -1) break;
  }

  if (childNumber !== -1 && toNumber >= childNumber) {
    let infoModalTxt = Util.getI18NTxt(
      stores,
      "I18N/WORKSPACE/CLAIMS/MOVE_CLAIM_MODAL_ERROR_CLAIM_ORDER"
    );

    infoModalTxt = Util.changeDataInI18NTxt(
      stores,
      infoModalTxt,
      "$NUMBER1$",
      childNumber + ""
    );
    infoModalTxt = Util.changeDataInI18NTxt(
      stores,
      infoModalTxt,
      "$NUMBER2$",
      fromNumber + ""
    );

    Util.openInfoModal(stores, infoModalTxt, true);

    workspaceStore.caseData.claims = tempClaims.value;
    return;
  }

  // 문제 없으면 청구항 이동 실행
  const backupClaims = JSON.parse(
    JSON.stringify(workspaceStore.caseData.claims)
  );

  workspaceStore.caseData.claims = ClaimHandler.moveClaim(
    tempClaims.value,
    fromNumber,
    toNumber,
    stores
  );

  // tldexie 저장
  const result = await tldexie.updateLayeredData(
    workspaceStore.active_save_slot,
    "claims",
    JSON.stringify(workspaceStore.caseData.claims)
  );
  if (result) {
    let msg = Util.getI18NTxt(stores, "I18N/WORKSPACE/CLAIMS/MOVE_RESULT");
    msg = Util.changeDataInI18NTxt(stores, msg, "$NUMBER1$", fromNumber + "");
    msg = Util.changeDataInI18NTxt(stores, msg, "$NUMBER2$", toNumber + "");

    workspaceStore.showSnackbar(msg, "info");
  } else {
    workspaceStore.showSnackbar(
      Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/UPDATE_FAILED").replace(
        "$DATA$",
        ""
      ),
      "error"
    );
  }
  tempClaims.value = [];
}

const draggableEndSpinner = (e: { oldIndex: number; newIndex: number }) =>
  claimsSpinner.value?.setSpinner(draggableEnd, "translucent")(e);

const claimCardHoverColor = computed(() => (index: number) => {
  if (claimHoverIndices.value[index]) {
    if (stores.ts.isDarkmode) return Util.getColor(stores, "TINTED_DARK");
    else return Util.getColor(stores, "TINTED");
  } else return themeStore.darkmodeBackgroundColor;
});

// HTML5 이벤트. 청구항 카드 드래그 시
function claimDragStart(e: Event) {
  claimHoverIndices.value.length = 0;
  let target = e.target as HTMLElement;
  target.style.backgroundColor = rgbToRgba("#5c6bc0", ".1");
}

// HTML5 이벤트. 청구항 카드 드래그 끝나면
function claimDragEnd(e: Event) {
  let target = e.target as HTMLElement;
  target.style.backgroundColor = "";
}

function openTreeModal() {
  actionModalTitle.value = Util.getI18NTxt(
    stores,
    "I18N/WORKSPACE/CLAIMS/CLAIM_TREE_MODAL_HEADER"
  );
  chartOptions.value.series[0].points = [];
  for (let i = 0; i < workspaceStore.caseData.claims.length; i++) {
    let color = "#DFDFDF";
    if (workspaceStore.caseData.claims[i].type === "I") color = "#FF499E";
    let parent = "";
    for (
      let j = 0;
      j < workspaceStore.caseData.claims[i].parentArray.length;
      j++
    ) {
      if (j !== workspaceStore.caseData.claims[i].parentArray.length - 1)
        parent =
          parent + workspaceStore.caseData.claims[i].parentArray[j] + ",";
      else parent = parent + workspaceStore.caseData.claims[i].parentArray[j];
    }

    chartOptions.value.series[0].points.push({
      name: workspaceStore.caseData.claims[i].claimNumber + "",
      id: workspaceStore.caseData.claims[i].claimNumber + "",
      parent: parent,
      color: color,
      attributes: {
        body: Util.replaceAll(
          Util.replaceAll(workspaceStore.caseData.claims[i].body, "<p>", ""),
          "</p>",
          "<br/>"
        ),
        category: Util.removePTag(workspaceStore.caseData.claims[i].category),
      },
    });
  }

  claimsTreeModal.value?.show();
}

function setClaimWizardLeft() {
  try {
    // 청구항 작성기 가져옴
    let claimWizardModal = document.getElementsByClassName(
      "modal-contents"
    )[0] as HTMLElement;
    // 청구항 창 너비
    let claimsWidth = claimsRef.value?.clientWidth;
    // 청구항 창 왼쪽 좌표
    let claimsOffsetLeft = claimsRef.value?.offsetLeft;
    // 청구항 작성기 모달 너비
    let claimWizardModalWidth = claimWizardModal.clientWidth;

    // null 처리
    if (
      Util.checkValidity(claimsOffsetLeft) &&
      Util.checkValidity(claimsWidth)
    ) {
      if (isClaimWizardDockLeft.value) {
        // 청구항 작성기 창 위치 왼쪽 모드면
        // console.log(claimsOffsetLeft, claimWizardModalWidth);
        if (claimsOffsetLeft - claimWizardModalWidth <= 30) {
          // 창이 브라우저 왼쪽 넘어가면
          claimWizardModalLeft.value = claimsOffsetLeft + claimsWidth + 10;
          workspaceStore.showSnackbar(
            Util.getI18NTxt(
              stores,
              "I18N/WORKSPACE/CLAIMS/NO_SPACE_FOR_EDITOR"
            ).replace("$DATA$", isClaimWizardDockLeft.value ? "LEFT" : "RIGHT"),
            "success"
          );
        } else {
          claimWizardModalLeft.value =
            claimsOffsetLeft - claimWizardModalWidth - 10;
        }
      } else {
        // 청구항 작성기 창 위치 오른쪽 모드면
        if (
          claimsOffsetLeft + claimsWidth + claimWizardModalWidth >
          window.innerWidth
        ) {
          // 창이 브라우저 오른쪽 넘어가면
          claimWizardModalLeft.value =
            claimsOffsetLeft - claimWizardModalWidth - 10;
          workspaceStore.showSnackbar(
            Util.getI18NTxt(
              stores,
              "I18N/WORKSPACE/CLAIMS/NO_SPACE_FOR_EDITOR"
            ).replace("$DATA$", isClaimWizardDockLeft.value ? "LEFT" : "RIGHT"),
            "success"
          );
        } else {
          claimWizardModalLeft.value = claimsOffsetLeft + claimsWidth + 10;
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
}

function dragStart(e: DragEvent) {
  // props에 watch 붙어 있는게 정상 작동 안해서 강제로 드래그 시작 시 false됨
  modelValue.value = false;
  workspaceStore.areaDragStart(e);
}

function dragEnd(e: DragEvent) {
  workspaceStore.areaDragEnd(e);
  modelValue.value = true;
}

// 하나 접기/펴기
function fold(index: number) {
  const backupClaims = JSON.parse(
    JSON.stringify(workspaceStore.caseData.claims)
  );

  workspaceStore.caseData.claims[index].fold =
    !workspaceStore.caseData.claims[index].fold;
  // tldexie 저장, dangling
  tldexie.updateLayeredData(
    workspaceStore.active_save_slot,
    "claims",
    JSON.stringify(workspaceStore.caseData.claims)
  );
}

const foldSpinner = (index: number) =>
  claimsSpinner.value?.setSpinner(fold)(index);

// 모두 접기/펴기
function foldAll(gubun: boolean) {
  const backupClaims = JSON.parse(
    JSON.stringify(workspaceStore.caseData.claims)
  );
  for (let i = 0; i < workspaceStore.caseData.claims.length; i++)
    workspaceStore.caseData.claims[i].fold = !gubun;
  // tldexie 저장, dangling

  tldexie.updateLayeredData(
    workspaceStore.active_save_slot,
    "claims",
    JSON.stringify(workspaceStore.caseData.claims)
  );
}

const foldAllSpinner = (gubun: boolean) =>
  claimsSpinner.value?.setSpinner(foldAll)(gubun);

// 독립항만 보기
function onlyIndependent() {
  const backupClaims = JSON.parse(
    JSON.stringify(workspaceStore.caseData.claims)
  );

  displayOnlyIndependent.value = !displayOnlyIndependent.value;

  if (displayOnlyIndependent.value) {
    for (let i = 0; i < workspaceStore.caseData.claims.length; i++) {
      if (workspaceStore.caseData.claims[i].type === "I")
        workspaceStore.caseData.claims[i].fold = false;
      else workspaceStore.caseData.claims[i].fold = true;
    }
  } else {
    for (let i = 0; i < workspaceStore.caseData.claims.length; i++)
      workspaceStore.caseData.claims[i].fold = false;
  }

  // tldexie 저장, dangling
  tldexie.updateLayeredData(
    workspaceStore.active_save_slot,
    "claims",
    JSON.stringify(workspaceStore.caseData.claims)
  );
}

const onlyIndependentSpinner = () =>
  claimsSpinner.value?.setSpinner(onlyIndependent, "translucent")();

const claimFooterBtnColor = computed(() => {
  if (themeStore.isDarkmode) return Util.getColor(stores, "BUTTON_DARK");
  else return Util.getColor(stores, "BUTTON");
});

// 청구항 작성기 오픈 - 청구항 1개 추가
function openAddClaimModal() {
  if (workspaceStore.claimWizardModal.isOpen) {
    if (!claimDataChanged()) {
      workspaceStore.updateWizardData = true;
      workspaceStore.claimWizardWorkType = "new";
      workspaceStore.claimWizardModal.isOpen = true;
      workspaceStore.setTargetClaimNumber(0);
      return;
    }

    modalStore.infoModal.hide();
    modalStore.infoModal.info = false;
    modalStore.infoModal.alert = false;
    modalStore.infoModal.title = Util.getI18NTxt(
      stores,
      "I18N/WORKSPACE/CLAIMS/CLAIM_EDITOR_MODAL_HEADER"
    );
    modalStore.infoModal.desc = Util.getI18NTxt(
      stores,
      "I18N/WORKSPACE/CLAIMS/CHANGE_DATA_ALERT"
    );
    modalStore.infoModal.buttonType = "NY";
    modalStore.infoModal.noButtonText = Util.getI18NTxt(
      stores,
      "I18N/BUTTON/NO"
    );
    modalStore.infoModal.noButtonFunc = () => {
      modalStore.infoModal.hide();
    };
    modalStore.infoModal.yesButtonText = Util.getI18NTxt(
      stores,
      "I18N/BUTTON/YES"
    );
    modalStore.infoModal.yesButtonFunc = () => {
      workspaceStore.updateWizardData = true;
      workspaceStore.claimWizardWorkType = "new";
      workspaceStore.claimWizardModal.isOpen = true;
      workspaceStore.setTargetClaimNumber(0);
      modalStore.infoModal.hide();
    };
    modalStore.infoModal.duration = undefined;
    modalStore.infoModal.closeBtn = false;
    // 모달 열기
    modalStore.infoModal.show();
  } else {
    workspaceStore.claimWizardWorkType = "new";
    workspaceStore.setTargetClaimNumber(0);
    workspaceStore.claimWizardModal.isOpen = true;
  }
}

// 여러 개 청구항 추가 모달 오픈
function openAddClaimsModal() {
  if (workspaceStore.claimWizardModal.isOpen) {
    Util.openInfoModal(
      stores,
      Util.getI18NTxt(stores, "I18N/WORKSPACE/CLAIMS/ADD_ALERT"),
      true
    );
    return;
  }

  actionModalTitle.value = Util.getI18NTxt(
    stores,
    "I18N/WORKSPACE/CLAIMS/MULTI_CLAIM_ADD"
  );

  actionModalDescription.value = Util.getI18NTxt(
    stores,
    "I18N/WORKSPACE/CLAIMS/ADD_CLAIMS_DESCRIPTION"
  );

  if (Util.isKIPO(stores)) {
    addCountPlaceholder.value = "숫자만";
  } else if (Util.isJPO(stores)) {
    addCountPlaceholder.value = "数字のみ";
  } else if (Util.isUSPTO(stores)) {
    addCountPlaceholder.value = "Only numbers";
  }

  claimType.value = "I";
  addCount.value = "";

  addClaimsModal.value?.show();
}

// 청구항 삽입 모듈
function openInsertClaimModal() {
  const check = /^[0-9]+$/;

  // 임시 targetClaimNumber. 실제 삽입으로 진행되어야 설정함
  let tempTargetClaimNumber = 0;

  // select에서 번호 선택한 경우
  if (
    !(
      claimNumberValue.value.value === "직접 입력" ||
      claimNumberValue.value.value === "直接入力" ||
      claimNumberValue.value.value === "Direct input"
    )
  ) {
    tempTargetClaimNumber = parseInt(claimNumberValue.value.value);
  }
  // 직접 입력인 경우
  else {
    if (!check.test(claimPosition.value)) {
      Util.openInfoModal(
        stores,
        Util.getI18NTxt(
          stores,
          "I18N/ACCOUNT_SETTING/CHANGE_PHONE_NUMBER_MODAL/PHONE_NUMBER_RULES"
        ),
        true
      );
      document.getElementById("claim-insert-position")?.focus();
      return;
    }

    if (claimPosition.value.trim() === "1") {
      Util.openInfoModal(
        stores,
        Util.getI18NTxt(
          stores,
          "I18N/WORKSPACE/CLAIMS/INSERT_CLAIM_MODAL_ERROR_CLAIM1"
        ),
        true
      );
      document.getElementById("claim-insert-position")?.focus();
      return;
    } else if (
      parseInt(claimPosition.value.trim()) >
      workspaceStore.caseData.claims.length
    ) {
      Util.openInfoModal(
        stores,
        Util.getI18NTxt(
          stores,
          "I18N/WORKSPACE/CLAIMS/MOVE_CLAIM_MODAL_ERROR_RANGE"
        ),
        true
      );
      document.getElementById("claim-insert-position")?.focus();
      return;
    }
    tempTargetClaimNumber = parseInt(claimPosition.value);
  }

  if (workspaceStore.claimWizardModal.isOpen) {
    if (!claimDataChanged()) {
      workspaceStore.updateWizardData = true;
      selectInsertPositionModal.value?.hide();
      workspaceStore.claimWizardWorkType = "insert";
      workspaceStore.setTargetClaimNumber(tempTargetClaimNumber);
      workspaceStore.claimWizardModal.isOpen = true;
      return;
    }

    modalStore.infoModal.hide();
    modalStore.infoModal.info = false;
    modalStore.infoModal.alert = false;
    modalStore.infoModal.title = Util.getI18NTxt(
      stores,
      "I18N/WORKSPACE/CLAIMS/INSERT_CLAIM_MODAL_HEADER"
    );
    modalStore.infoModal.desc = Util.getI18NTxt(
      stores,
      "I18N/WORKSPACE/CLAIMS/CHANGE_DATA_ALERT"
    );
    modalStore.infoModal.buttonType = "NY";
    modalStore.infoModal.noButtonText = Util.getI18NTxt(
      stores,
      "I18N/BUTTON/NO"
    );
    modalStore.infoModal.noButtonFunc = () => {
      modalStore.infoModal.hide();
    };
    modalStore.infoModal.yesButtonText = Util.getI18NTxt(
      stores,
      "I18N/BUTTON/YES"
    );
    modalStore.infoModal.yesButtonFunc = () => {
      modalStore.infoModal.hide();
      workspaceStore.updateWizardData = true;
      selectInsertPositionModal.value?.hide();
      workspaceStore.claimWizardWorkType = "insert";
      workspaceStore.setTargetClaimNumber(tempTargetClaimNumber);
      workspaceStore.claimWizardModal.isOpen = true;
    };
    modalStore.infoModal.duration = undefined;
    modalStore.infoModal.closeBtn = false;
    // 모달 열기
    modalStore.infoModal.show();
  } else {
    selectInsertPositionModal.value?.hide();
    workspaceStore.claimWizardWorkType = "insert";
    workspaceStore.setTargetClaimNumber(tempTargetClaimNumber);
    workspaceStore.claimWizardModal.isOpen = true;
  }
}

// 인용 청구항 선택 모달 오픈
function openParentClaimSelectModal() {
  // 청구항 선택용 배열 초기화
  selectedClaims.value = [];
  for (let i = 0; i < workspaceStore.caseData.claims.length; i++) {
    selectedClaims.value.push(false);
  }

  // 전체선택 초기화
  selectAllClaimsAsParent.value = false;

  // 부모 청구항 초기화는 여기서 안함(모달 띄웠다가 그냥 닫는 경우도 있으므로)

  // 모달 오픈
  parentClaimSelectModal.value.show();
}

// 부모 청구항 선택
function selectParentClaim(idx: number) {
  const tempSelectedClaims = JSON.parse(JSON.stringify(selectedClaims.value));

  // 전체 선택
  if (idx === -1) {
    for (let i = 0; i < tempSelectedClaims.length; i++) {
      tempSelectedClaims[i] = !selectAllClaimsAsParent.value;
    }

    const tempArray = [];
    for (let i = 0; i < tempSelectedClaims.length; i++) {
      if (tempSelectedClaims[i]) tempArray.push(i + 1);
    }

    // 카테고리 동일 체크
    const categoryCheckResult = ClaimHandler.checkSameCategory(
      workspaceStore.caseData.claims,
      tempArray
    );
    if (!categoryCheckResult) {
      Util.openInfoModal(
        stores,
        Util.getI18NTxt(
          stores,
          "I18N/WORKSPACE/CLAIMS/SELECT_PARENT_CLAIM_ERROR_DIFFERENT_CATEGORY"
        ).replace("$NUMBER$", "1"), // 전체선택이어서, 1항으로 강제 셋팅
        true
      );

      // 체크 상태 해제 (v-model 값 변경으로 제어가 안되어서 dom으로 컨트롤함)
      document.getElementById("select-all").checked = false;

      return;
    }

    // 멀티 인용 체크(JPO인 경우에는 체크하지 않음) --> 법 바뀌어서 이제 체크함
    const multiCheckResult = ClaimHandler.checkMultiCitation(
      workspaceStore.caseData.claims,
      tempArray
    );

    if (!multiCheckResult.isValid) {
      Util.openInfoModal(
        stores,
        Util.getI18NTxt(
          stores,
          "I18N/WORKSPACE/CLAIMS/SELECT_PARENT_CLAIM_ERROR_MULTISELECT"
        ).replace("$NUMBER$", multiCheckResult.invalidClaimNumber),
        true
      );

      // 체크 상태 해제 (v-model 값 변경으로 제어가 안되어서 dom으로 컨트롤함)
      document.getElementById("select-all").checked = false;

      return;
    }

    selectAllClaimsAsParent.value = !selectAllClaimsAsParent.value;
    for (let i = 0; i < selectedClaims.value.length; i++) {
      selectedClaims.value[i] = selectAllClaimsAsParent.value;
    }
  }
  // 항마다 선택
  else {
    tempSelectedClaims[idx] = !tempSelectedClaims[idx];

    const tempArray = [];
    for (let i = 0; i < tempSelectedClaims.length; i++) {
      if (tempSelectedClaims[i]) tempArray.push(i + 1);
    }

    // 카테고리 동일 체크
    const categoryCheckResult = ClaimHandler.checkSameCategory(
      workspaceStore.caseData.claims,
      tempArray
    );
    if (!categoryCheckResult) {
      Util.openInfoModal(
        stores,
        Util.getI18NTxt(
          stores,
          "I18N/WORKSPACE/CLAIMS/SELECT_PARENT_CLAIM_ERROR_DIFFERENT_CATEGORY"
        ).replace("$NUMBER$", idx + 1),
        true
      );

      // 체크 상태 해제 (v-model 값 변경으로 제어가 안되어서 dom으로 컨트롤함)
      document.getElementById("select-all").checked = false;

      return;
    }

    // 멀티 인용 체크(JPO인 경우에는 체크하지 않음)
    if (Util.isKIPO(stores) || Util.isUSPTO(stores)) {
      const multiCheckResult = ClaimHandler.checkMultiCitation(
        workspaceStore.caseData.claims,
        tempArray
      );

      if (!multiCheckResult.isValid) {
        Util.openInfoModal(
          stores,
          Util.getI18NTxt(
            stores,
            "I18N/WORKSPACE/CLAIMS/SELECT_PARENT_CLAIM_ERROR_MULTISELECT"
          ).replace("$NUMBER$", multiCheckResult.invalidClaimNumber),
          true
        );

        // 체크 상태 해제 (v-model 값 변경으로 제어가 안되어서 dom으로 컨트롤함)
        document.getElementById("select-all").checked = false;

        return;
      }
    }

    selectedClaims.value[idx] = !selectedClaims.value[idx];

    if (selectedClaims.value.includes(false))
      selectAllClaimsAsParent.value = false;
    else selectAllClaimsAsParent.value = true;
  }
}

// 인용 청구항 선택 완료
function saveParentClaim() {
  // 선택된 청구항이 없으면 리턴
  if (!selectedClaims.value.includes(true)) {
    Util.openInfoModal(
      stores,
      Util.getI18NTxt(
        stores,
        "I18N/WORKSPACE/CLAIMS/SELECT_PARENT_CLAIM_MODAL_CONTENT"
      ),
      true
    );
    return;
  }

  // 부모 청구항 초기화
  parentArray.value = [];

  for (let i = 0; i < selectedClaims.value.length; i++) {
    if (selectedClaims.value[i]) parentArray.value.push(i + 1);
  }

  // 청구항 인용 문구 셋팅
  quotationTxt.value = ClaimHandler.makeQuotationText(
    workspaceStore.caseMasterData.format_code_path,
    Util.getIdiomData(stores, "DR_IDIOM/TEMPLATE/CLAIM_CITATION/C1"),
    Util.getIdiomData(stores, "DR_IDIOM/TEMPLATE/CLAIM_CITATION/C2"),
    Util.getIdiomData(stores, "DR_IDIOM/TEMPLATE/CLAIM_CITATION/C3_CONTINUOUS"),
    Util.getIdiomData(
      stores,
      "DR_IDIOM/TEMPLATE/CLAIM_CITATION/C3_NONCONTINUOUS"
    ),
    parentArray.value
  );
  // console.log(quotationTxt.value);

  // TODO: USPTO일 때 the 붙여주기

  // 모달 닫기
  parentClaimSelectModal.value.hide();
}

// 삽입 위치 결정 모달 오픈
function openSelectInsertPositionModal() {
  actionModalTitle.value = Util.getI18NTxt(
    stores,
    "I18N/WORKSPACE/CLAIMS/INSERT_CLAIM_MODAL_HEADER"
  );
  actionModalDescription.value = Util.getI18NTxt(
    stores,
    "I18N/WORKSPACE/CLAIMS/INSERT_CLAIM_MODAL_INPUT_GUIDE"
  );

  claimNumberOptions.value = [];
  if (Util.isKIPO(stores)) {
    claimNumberOptions.value.push({
      text: "직접 입력",
      value: "직접 입력",
    });
    claimNumberPlaceholder.value = "숫자만";
  } else if (Util.isJPO(stores)) {
    claimNumberOptions.value.push({
      text: "直接入力",
      value: "直接入力",
    });
    claimNumberPlaceholder.value = "数字のみ";
  } else if (Util.isUSPTO(stores)) {
    claimNumberOptions.value.push({
      text: "Direct input",
      value: "Direct input",
    });
    claimNumberPlaceholder.value = "Only numbers";
  }

  for (let i = 1; i < workspaceStore.caseData.claims.length + 1; i++) {
    claimNumberOptions.value.push({
      text: i + 1 + "",
      value: i + 1 + "",
    });
  }

  claimNumberValue.value = {
    text: workspaceStore.caseData.claims.length + 1 + "",
    value: workspaceStore.caseData.claims.length + 1 + "",
  };

  claimPosition.value = "";

  selectInsertPositionModal.value?.show();
}

// 청구항 이동 모달
function openMoveClaimModal(element: any, index: number) {
  if (workspaceStore.claimWizardModal.isOpen) {
    Util.openInfoModal(
      stores,
      Util.getI18NTxt(stores, "I18N/WORKSPACE/CLAIMS/MOVE_ALERT"),
      true
    );
    return;
  }

  actionModalTitle.value = Util.getI18NTxt(
    stores,
    "I18N/WORKSPACE/CLAIMS/MOVE_CLAIM_MODAL_HEADER"
  );

  actionModalDescription.value = Util.changeDataInI18NTxt(
    stores,
    Util.getI18NTxt(stores, "I18N/WORKSPACE/CLAIMS/MOVE_CLAIM_MODAL_CONTENT"),
    "$NUMBER$",
    element.claimNumber + ""
  );

  claimNumberOptions.value = [];
  if (Util.isKIPO(stores)) {
    claimNumberOptions.value.push({
      text: "직접 입력",
      value: "직접 입력",
    });
    claimNumberPlaceholder.value = "숫자만";
  } else if (Util.isJPO(stores)) {
    claimNumberOptions.value.push({
      text: "直接入力",
      value: "直接入力",
    });
    claimNumberPlaceholder.value = "数字のみ";
  } else if (Util.isUSPTO(stores)) {
    claimNumberOptions.value.push({
      text: "Direct input",
      value: "Direct input",
    });
    claimNumberPlaceholder.value = "Only numbers";
  }

  for (let i = 1; i < workspaceStore.caseData.claims.length; i++) {
    claimNumberOptions.value.push({
      text: i + 1 + "",
      value: i + 1 + "",
    });
  }

  claimNumberValue.value = claimNumberOptions.value[0];

  claimPosition.value = "";

  tempTargetClaimNumber.value = element.claimNumber;

  moveClaimModal.value?.show();
}

const claimCardBtnBgColor = computed(() => {
  if (themeStore.isDarkmode) return Util.getColor(stores, "BUTTON_DARK");
  else return Util.getColor(stores, "BUTTON");
});

function openEditClaimModal(element: any, index: number) {
  if (workspaceStore.claimWizardModal.isOpen) {
    // 현재 떠 있는 에디터의 수정 청구항이 자신이면 그냥 리턴
    if (element.claimNumber === workspaceStore.targetClaimNumber) return;

    if (!claimDataChanged()) {
      workspaceStore.updateWizardData = true;
      workspaceStore.claimWizardWorkType = "update";
      workspaceStore.targetClaimNumber = element.claimNumber;
      workspaceStore.claimWizardModal.isOpen = true;
      return;
    }

    modalStore.infoModal.hide();
    modalStore.infoModal.info = false;
    modalStore.infoModal.alert = false;
    modalStore.infoModal.title = Util.getI18NTxt(
      stores,
      "I18N/WORKSPACE/CLAIMS/EDIT_CLAIM"
    );
    modalStore.infoModal.desc = Util.getI18NTxt(
      stores,
      "I18N/WORKSPACE/CLAIMS/CHANGE_DATA_ALERT"
    );
    modalStore.infoModal.buttonType = "NY";
    modalStore.infoModal.noButtonText = Util.getI18NTxt(
      stores,
      "I18N/BUTTON/NO"
    );
    modalStore.infoModal.noButtonFunc = () => {
      modalStore.infoModal.hide();
    };
    modalStore.infoModal.yesButtonText = Util.getI18NTxt(
      stores,
      "I18N/BUTTON/YES"
    );
    modalStore.infoModal.yesButtonFunc = () => {
      modalStore.infoModal.hide();
      workspaceStore.updateWizardData = true;
      workspaceStore.claimWizardWorkType = "update";
      workspaceStore.targetClaimNumber = element.claimNumber;
      workspaceStore.claimWizardModal.isOpen = true;
    };
    modalStore.infoModal.duration = undefined;
    modalStore.infoModal.closeBtn = false;
    // 모달 열기
    modalStore.infoModal.show();
  } else {
    workspaceStore.claimWizardWorkType = "update";
    workspaceStore.targetClaimNumber = element.claimNumber;
    workspaceStore.claimWizardModal.isOpen = true;
  }
}

function openDeleteClaimModal(element: any, index: number) {
  if (workspaceStore.claimWizardModal.isOpen) {
    Util.openInfoModal(
      stores,
      Util.getI18NTxt(stores, "I18N/WORKSPACE/CLAIMS/DELETE_ALERT"),
      true
    );

    return;
  }

  // 자식 청구항이 있는 경우에는 삭제를 막음
  for (let i = index + 1; i < workspaceStore.caseData.claims.length; i++) {
    // 각 청구항의 부모 청구항 배열 가져옴
    const parentCombinationArray = ClaimHandler.getParentClaimSet(
      workspaceStore.caseData.claims,
      workspaceStore.caseData.claims[i].claimNumber
    );

    let hasChild = false;

    // 부모 청구항 배열 중에 삭제하려는 청구항이 있으면, hasChild를 true로 해서 삭제 막음
    for (let j = 0; j < parentCombinationArray.length; j++) {
      if (parentCombinationArray[j].includes(element.claimNumber)) {
        hasChild = true;
        break;
      }
    }

    if (hasChild) {
      let msg = Util.getI18NTxt(
        stores,
        "I18N/WORKSPACE/CLAIMS/DELETE_CLAIM_MODAL_ERROR_CONTENT_CITED"
      );
      msg = Util.changeDataInI18NTxt(
        stores,
        msg,
        "$NUMBER1$",
        element.claimNumber + ""
      );
      msg = Util.changeDataInI18NTxt(stores, msg, "$NUMBER2$", i + 1 + "");
      Util.openInfoModal(stores, msg, true);

      return;
    }
  }

  // 삭제해도 괜찮은 경우에 삭제 진행할 건지 확인 받음
  tempTargetClaimNumber.value = element.claimNumber;
  // workspaceStore.targetClaimNumber = element.claimNumber;

  actionModalTitle.value = Util.getI18NTxt(
    stores,
    "I18N/WORKSPACE/CLAIMS/DELETE_CLAIM_CONFIRM_MODAL_HEADER"
  );

  actionModalDescription.value = Util.changeDataInI18NTxt(
    stores,
    Util.getI18NTxt(stores, "I18N/WORKSPACE/CLAIMS/DELETE_CLAIM_MODAL_CONTENT"),
    "$NUMBER$",
    element.claimNumber + ""
  );

  deleteClaimConfirmModal.value?.show();
}

function openDeleteClaimsModal() {
  if (workspaceStore.claimWizardModal.isOpen) {
    Util.openInfoModal(
      stores,
      Util.getI18NTxt(stores, "I18N/WORKSPACE/CLAIMS/DELETE_ALERT"),
      true
    );
    return;
  }

  actionModalTitle.value = Util.getI18NTxt(
    stores,
    "I18N/WORKSPACE/CLAIMS/MULTI_CLAIM_DELETE"
  );
  actionModalDescription.value = Util.getI18NTxt(
    stores,
    "I18N/WORKSPACE/CLAIMS/DELETE_GUIDE"
  );
  deteteTargetClaims.value = "";

  deleteClaimsModal.value?.show();
}

async function deleteClaim() {
  // 백업용 임시 배열
  let backupClaims = JSON.parse(JSON.stringify(workspaceStore.caseData.claims));

  // 스토어의 targetClaimNumber 셋팅
  workspaceStore.targetClaimNumber = tempTargetClaimNumber.value;

  workspaceStore.caseData.claims = ClaimHandler.deleteClaim(
    workspaceStore.caseData.claims,
    workspaceStore.targetClaimNumber,
    stores
  );

  // tldexie 저장

  const result = await tldexie.updateLayeredData(
    workspaceStore.active_save_slot,
    "claims",
    JSON.stringify(workspaceStore.caseData.claims)
  );

  // TODO: 스낵바 I18N
  if (result) {
    let msg = Util.getI18NTxt(stores, "I18N/WORKSPACE/CLAIMS/DELETE_RESULT");
    msg = Util.changeDataInI18NTxt(
      stores,
      msg,
      "$NUMBER$",
      workspaceStore.targetClaimNumber + ""
    );

    workspaceStore.showSnackbar(msg, "info");
  } else {
    workspaceStore.showSnackbar(
      Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/DELETE_FAILED").replace(
        "$DATA$",
        ""
      ),
      "error"
    );
  }
  deleteClaimConfirmModal.value?.hide();
  workspaceStore.setTargetClaimNumber(0);

  // workspace에 포커스를 강제로 주기 위함
  document.getElementById("hidden-input")?.focus();
}

const deleteClaimSpinner = () =>
  deleteClaimModalSpinner.value?.setSpinner(deleteClaim, "translucent")();

async function deleteClaims() {
  // 일본어인 경우 반각처리. 다른 언어면 그냥 그대로임
  let tempTargetClaims = Util.toJPHalfWidth(deteteTargetClaims.value);
  tempTargetClaims = tempTargetClaims.replace(/，/g, ",");
  tempTargetClaims = tempTargetClaims.replace(/－/g, "-");
  tempTargetClaims = tempTargetClaims.replace(/ /g, "");
  tempTargetClaims = tempTargetClaims.replace(/　/g, "");

  const tempArray = tempTargetClaims.split(",");

  const check = /^[0-9]+$/;

  let deleteTargetClaimsArray = [];
  for (let i = 0; i < tempArray.length; i++) {
    if (check.test(tempArray[i])) {
      if (!deleteTargetClaimsArray.includes(parseInt(tempArray[i])))
        deleteTargetClaimsArray.push(parseInt(tempArray[i]));
    } else if (
      tempArray[i].split("-").length == 2 &&
      check.test(tempArray[i].split("-")[0]) &&
      check.test(tempArray[i].split("-")[1])
    ) {
      const startNumber = parseInt(tempArray[i].split("-")[0]);
      const endNumber = parseInt(tempArray[i].split("-")[1]) + 1;
      for (let j = startNumber; j < endNumber; j++) {
        if (!deleteTargetClaimsArray.includes(j))
          deleteTargetClaimsArray.push(j);
      }
    } else {
      // 정해진 양식대로의 입력이 아님
      Util.openInfoModal(
        stores,
        Util.getI18NTxt(
          stores,
          "I18N/ACCOUNT_SETTING/CHANGE_PHONE_NUMBER_MODAL/PHONE_NUMBER_RULES"
        ),
        true
      );
      return;
    }
  }

  // 오름차순 정렬
  deleteTargetClaimsArray = Util.ascSort(deleteTargetClaimsArray);

  console.log(deleteTargetClaimsArray);

  // 1항인 경우 삭제 금지
  if (deleteTargetClaimsArray.includes(1)) {
    Util.openInfoModal(
      stores,
      Util.getI18NTxt(
        stores,
        "I18N/WORKSPACE/CLAIMS/DELETE_CLAIM_MODAL_ERROR_CONTENT_CLAIM1"
      ),
      true
    );
    return;
  }

  // 청구항 개수 이내에서 입력
  if (
    Math.max(deleteTargetClaimsArray) > workspaceStore.caseData.claims.length
  ) {
    Util.openInfoModal(
      stores,
      Util.getI18NTxt(
        stores,
        "I18N/WORKSPACE/CLAIMS/MOVE_CLAIM_MODAL_ERROR_RANGE"
      ),
      true
    );
    return;
  }

  // 삭제 체크용 임시 배열
  let tempClaimsForDelete = JSON.parse(
    JSON.stringify(workspaceStore.caseData.claims)
  );
  // 백업용 임시 배열
  let backupClaims = JSON.parse(JSON.stringify(workspaceStore.caseData.claims));

  // 각 삭제 대상 청구항들을 역순으로 돌면서 하나씩 지워봄. 문제 생기면 빠져나감
  for (let i = deleteTargetClaimsArray.length - 1; i >= 0; i--) {
    // 삭제 후보 청구항
    const claimNumber = deleteTargetClaimsArray[i];
    // console.log("check " + claimNumber);
    // 자식 청구항이 있는 경우에는 삭제를 막음
    for (let j = claimNumber; j < tempClaimsForDelete.length; j++) {
      // 각 청구항의 부모 청구항 배열 가져옴
      const parentCombinationArray = ClaimHandler.getParentClaimSet(
        tempClaimsForDelete,
        tempClaimsForDelete[j].claimNumber
      );

      let hasChild = false;

      // 부모 청구항 배열 중에 삭제하려는 청구항이 있으면, hasChild를 true로 해서 삭제 막음
      for (let k = 0; k < parentCombinationArray.length; k++) {
        if (parentCombinationArray[k].includes(claimNumber)) {
          hasChild = true;
          break;
        }
      }

      if (hasChild) {
        let msg = Util.getI18NTxt(
          stores,
          "I18N/WORKSPACE/CLAIMS/DELETE_CLAIM_MODAL_ERROR_CONTENT_CITED"
        );
        msg = Util.changeDataInI18NTxt(
          stores,
          msg,
          "$NUMBER1$",
          claimNumber + ""
        );
        msg = Util.changeDataInI18NTxt(stores, msg, "$NUMBER2$", j + 1 + "");
        Util.openInfoModal(stores, msg, true);

        return;
      }
    }
    // console.log(claimNumber + "삭제 가능");

    tempClaimsForDelete = ClaimHandler.deleteClaim(
      tempClaimsForDelete,
      claimNumber,
      stores
    );
  }

  //위의 루프가 중간에 안끊기고 여기까지 왔다는 건 삭제해도 된다는거 -> 삭제 실행
  for (let i = deleteTargetClaimsArray.length - 1; i >= 0; i--) {
    // 삭제 후보 청구항
    const claimNumber = deleteTargetClaimsArray[i];
    workspaceStore.caseData.claims = ClaimHandler.deleteClaim(
      workspaceStore.caseData.claims,
      claimNumber,
      stores
    );
  }

  // tldexie 저장

  const result = await tldexie.updateLayeredData(
    workspaceStore.active_save_slot,
    "claims",
    JSON.stringify(workspaceStore.caseData.claims)
  );
  if (result) {
    let msg = Util.getI18NTxt(stores, "I18N/WORKSPACE/CLAIMS/DELETE_RESULT");
    msg = Util.changeDataInI18NTxt(
      stores,
      msg,
      "$NUMBER$",
      deleteTargetClaimsArray + ""
    );
    workspaceStore.showSnackbar(msg, "info");
  } else {
    workspaceStore.showSnackbar(
      Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/DELETE_FAILED").replace(
        "$DATA$",
        ""
      ),
      "error"
    );
  }
  deleteClaimsModal.value?.hide();
}

const deleteClaimsSpinner = () =>
  deleteClaimsModalSpinner.value?.setSpinner(deleteClaims, "translucent")();

async function addClaims() {
  if (addCount.value.trim() === "") {
    Util.openInfoModal(
      stores,
      Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/REQUEST_DATA_ALERT"),
      true
    );
    document.getElementById("add-count")?.focus();
    return;
  }

  // 일본어 전자인 경우에는 강제로 반자로 변환
  addCount.value = Util.toJPHalfWidth(addCount.value);

  const check = /^[0-9]+$/;
  // 직접 입력인 경우
  if (!check.test(addCount.value.trim())) {
    Util.openInfoModal(
      stores,
      Util.getI18NTxt(
        stores,
        "I18N/ACCOUNT_SETTING/CHANGE_PHONE_NUMBER_MODAL/PHONE_NUMBER_RULES"
      ),
      true
    );
    document.getElementById("add-count")?.focus();
    return;
  }

  if (claimType.value === "D" && !parentArray.value.length) {
    Util.openInfoModal(
      stores,
      Util.getI18NTxt(stores, "I18N/WORKSPACE/CLAIMS/CHOOSE_PARENT_ALERT"),
      true
    );
    return;
  }

  // 청구항 추가 진행
  let backupClaims = JSON.parse(JSON.stringify(workspaceStore.caseData.claims));

  for (let i = 0; i < parseInt(addCount.value.trim()); i++) {
    const claimNumber = workspaceStore.caseData.claims.length + 1;
    const claimData = {
      claimNumber: claimNumber,
      type: claimType.value,
      parentArray: [],
      quotationTxt: "",
      transition: "",
      body: "",
      category: Util.makeClaimCategory(stores, claimNumber, "I"),
      fold: false,
      show: true,
    };

    // 종속항인 경우
    if (claimType.value === "D") {
      claimData.parentArray = parentArray.value;
      claimData.quotationTxt = "<p>" + quotationTxt.value + "</p>";
      if (Util.isUSPTO(stores)) {
        let parentCategory = Util.removePTag(
          workspaceStore.caseData.claims[parentArray.value[0] - 1].category
        ).trim();

        claimData.category = "<p>" + Util.changeAtoThe(parentCategory) + "</p>";
      } else
        claimData.category =
          workspaceStore.caseData.claims[parentArray.value[0] - 1].category;
    }

    workspaceStore.caseData.claims = ClaimHandler.saveClaim(
      workspaceStore.caseData.claims,
      0,
      claimData,
      "A",
      stores
    );
  }

  // tldexie 저장
  const result = await tldexie.updateLayeredData(
    workspaceStore.active_save_slot,
    "claims",
    JSON.stringify(workspaceStore.caseData.claims)
  );

  if (result) {
    let msg = Util.getI18NTxt(
      stores,
      "I18N/WORKSPACE/CLAIMS/ADD_CLAIMS_RESULT"
    );
    msg = Util.changeDataInI18NTxt(
      stores,
      msg,
      "$NUMBER1$",
      addCount.value.trim()
    );
    msg = Util.changeDataInI18NTxt(
      stores,
      msg,
      "$NUMBER2$",
      backupClaims.length + ""
    );

    workspaceStore.showSnackbar(msg, "info");
  } else {
    workspaceStore.showSnackbar(
      Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/SAVE_FAILED").replace(
        "$DATA$",
        ""
      ),
      "error"
    );
  }
  // workspace에 포커스를 강제로 주기 위함
  document.getElementById("hidden-input")?.focus();
}

const addClaimsSpinner = () =>
  addClaimsModalSpinner.value?.setSpinner(addClaims, "translucent")();

async function moveClaim() {
  // 직접 입력인데 청구항 번호가 입력되지 않은 경우 차단
  if (
    (claimNumberValue.value.value === "직접 입력" ||
      claimNumberValue.value.value === "直接入力" ||
      claimNumberValue.value.value === "Direct input") &&
    claimPosition.value.trim() === ""
  ) {
    document.getElementById("claim-move-position")?.focus();
    return;
  }

  // 직접 입력인데 숫자가 아닌 다른 글자가 입력된 경우
  const check = /^[0-9]+$/;
  if (
    claimNumberValue.value.value === "직접 입력" ||
    claimNumberValue.value.value === "直接入力" ||
    claimNumberValue.value.value === "Direct input"
  ) {
    // 직접 입력인 경우
    if (!check.test(claimPosition.value)) {
      Util.openInfoModal(
        stores,
        Util.getI18NTxt(
          stores,
          "I18N/ACCOUNT_SETTING/CHANGE_PHONE_NUMBER_MODAL/PHONE_NUMBER_RULES"
        ),
        true
      );
      document.getElementById("claim-move-position")?.focus();
      return;
    }
  }

  // toNumber 설정
  let toNumber = 0;
  if (
    claimNumberValue.value.value === "직접 입력" ||
    claimNumberValue.value.value === "直接入力" ||
    claimNumberValue.value.value === "Direct input"
  )
    toNumber = parseInt(claimPosition.value);
  else toNumber = parseInt(claimNumberValue.value.value);

  // fromNumber와 같은 번호 입력된 경우
  if (tempTargetClaimNumber.value === toNumber) {
    Util.openInfoModal(
      stores,
      Util.getI18NTxt(
        stores,
        "I18N/WORKSPACE/CLAIMS/MOVE_CLAIM_MODAL_ERROR_SAME_NUMBER"
      ),
      true
    );
    document.getElementById("claim-move-position")?.focus();
    return;
  }

  // 이동 위치로 1항이 입력된 경우
  if (toNumber === 1) {
    Util.openInfoModal(
      stores,
      Util.getI18NTxt(
        stores,
        "I18N/WORKSPACE/CLAIMS/MOVE_CLAIM_MODAL_ERROR_CLAIM1"
      ),
      true
    );
    document.getElementById("claim-move-position")?.focus();
    return;
  }

  // 이동 위치로 청구항 번호보다 큰 청구항이 입력된 경우
  if (toNumber > workspaceStore.caseData.claims.length) {
    Util.openInfoModal(
      stores,
      Util.getI18NTxt(
        stores,
        "I18N/WORKSPACE/CLAIMS/MOVE_CLAIM_MODAL_ERROR_RANGE"
      ),
      true
    );
    document.getElementById("claim-move-position")?.focus();
    return;
  }

  // 내가 이동하려는 목적 위치가 내가 인용하고 있는 항보다 작은 경우
  if (
    toNumber <=
    Math.max(
      ...workspaceStore.caseData.claims[tempTargetClaimNumber.value - 1]
        .parentArray
    )
  ) {
    let maxNumber = Math.max(
      ...workspaceStore.caseData.claims[tempTargetClaimNumber.value - 1]
        .parentArray
    );
    let infoModalTxt = Util.getI18NTxt(
      stores,
      "I18N/WORKSPACE/CLAIMS/MOVE_CLAIM_MODAL_ERROR_CLAIM_ORDER"
    );
    infoModalTxt = Util.changeDataInI18NTxt(
      stores,
      infoModalTxt,
      "$NUMBER1$",
      tempTargetClaimNumber.value + ""
    );
    infoModalTxt = Util.changeDataInI18NTxt(
      stores,
      infoModalTxt,
      "$NUMBER2$",
      maxNumber + ""
    );

    Util.openInfoModal(stores, infoModalTxt, true);
    return;
  }

  // 내가 이동하려는 목적 위치가 나를 인용하는 항보다 큰 경우
  let childNumber = -1;

  for (
    let i = tempTargetClaimNumber.value;
    i < workspaceStore.caseData.claims.length;
    i++
  ) {
    // 각 청구항의 부모 청구항 배열 가져옴
    const parentCombinationArray = ClaimHandler.getParentClaimSet(
      workspaceStore.caseData.claims,
      workspaceStore.caseData.claims[i].claimNumber
    );

    // 부모 청구항 배열 중에 삭제하려는 청구항이 있으면, hasChild를 true로 해서 삭제 막음
    for (let j = 0; j < parentCombinationArray.length; j++) {
      if (parentCombinationArray[j].includes(tempTargetClaimNumber.value)) {
        childNumber = i + 1;
        break;
      }
    }

    if (childNumber !== -1) break;
  }

  // console.log(childNumber);

  if (childNumber !== -1 && toNumber >= childNumber) {
    let infoModalTxt = Util.getI18NTxt(
      stores,
      "I18N/WORKSPACE/CLAIMS/MOVE_CLAIM_MODAL_ERROR_CLAIM_ORDER"
    );
    infoModalTxt = Util.changeDataInI18NTxt(
      stores,
      infoModalTxt,
      "$NUMBER1$",
      childNumber + ""
    );
    infoModalTxt = Util.changeDataInI18NTxt(
      stores,
      infoModalTxt,
      "$NUMBER2$",
      tempTargetClaimNumber.value + ""
    );

    Util.openInfoModal(stores, infoModalTxt, true);
    return;
  }

  // 문제 없으면 청구항 이동 실행
  const backupClaims = JSON.parse(
    JSON.stringify(workspaceStore.caseData.claims)
  );

  workspaceStore.targetClaimNumber = tempTargetClaimNumber.value;

  workspaceStore.caseData.claims = ClaimHandler.moveClaim(
    workspaceStore.caseData.claims,
    workspaceStore.targetClaimNumber,
    toNumber,
    stores
  );

  // tldexie 저장
  const result = await tldexie.updateLayeredData(
    workspaceStore.active_save_slot,
    "claims",
    JSON.stringify(workspaceStore.caseData.claims)
  );

  if (result) {
    let msg = Util.getI18NTxt(stores, "I18N/WORKSPACE/CLAIMS/MOVE_RESULT");
    msg = Util.changeDataInI18NTxt(
      stores,
      msg,
      "$NUMBER1$",
      workspaceStore.targetClaimNumber + ""
    );
    msg = Util.changeDataInI18NTxt(stores, msg, "$NUMBER2$", toNumber + "");
    workspaceStore.showSnackbar(msg, "info");
  } else {
    workspaceStore.showSnackbar(
      Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/UPDATE_FAILED").replace(
        "$DATA$",
        ""
      ),
      "error"
    );
  }
  moveClaimModal.value?.hide();
  workspaceStore.setTargetClaimNumber(0);
}

const moveClaimSpinner = () => claimsSpinner.value?.setSpinner(moveClaim)();

function claimDataChanged() {
  // 떠 있는 청구항 작성기가 추가나 삽입인 경우
  if (
    workspaceStore.claimWizardWorkType === "new" ||
    workspaceStore.claimWizardWorkType === "insert"
  ) {
    // console.log("떠있는게 추가나 삽입");
    return true;
  }
  // 떠 있는 청구항 작성기가 편집 상태인 경우
  else if (workspaceStore.claimWizardWorkType === "update") {
    // console.log("떠있는게 수정");
    const targetClaimData =
      workspaceStore.caseData.claims[workspaceStore.targetClaimNumber - 1];

    // console.log(
    //   targetClaimData.quotationTxt,
    //   tinymce.get("quotation-text")
    //     ? tinymce.get("quotation-text").getContent()
    //     : "",
    //   targetClaimData.quotationTxt ===
    //     (tinymce.get("quotation-text")
    //       ? tinymce.get("quotation-text").getContent()
    //       : "")
    // );
    // console.log(
    //   targetClaimData.body,
    //   tinymce.get("claim-body").getContent(),
    //   targetClaimData.body === tinymce.get("claim-body").getContent()
    // );
    // console.log(
    //   targetClaimData.category,
    //   tinymce.get("claim-category").getContent(),
    //   targetClaimData.category === tinymce.get("claim-category").getContent()
    // );

    if (
      targetClaimData.quotationTxt ===
        (tinymce.get("quotation-text")
          ? tinymce.get("quotation-text").getContent()
          : "") &&
      targetClaimData.body === tinymce.get("claim-body").getContent() &&
      targetClaimData.category === tinymce.get("claim-category").getContent()
    )
      return false;
    else return true;
  }
  // 어느 것도 아닌 경우(실제로는 없음)
  else return true;
}

onBeforeMount(() => {
  workspaceStore.claimWizardModal.isOpen = false;
  workspaceStore.updateWizardData = false;

  // 구성요소 번호 보기 셋팅
  if (Util.getSettingValue(stores, "SETTING/DRAFT/CLAIM_SHOW_NUMBER") === "N")
    showNumber.value = false;
});

onMounted(() => {
  console.log("claims mounted");

  // 환경 설정 값에 맞춰서 청구항 마법사 위치 지정
  isClaimWizardDockLeft.value = workspaceStore.isClaimWizardLeft;

  isMounted.value = true;
});

// props가 바뀔 때(부모에서 값이 바뀔 때)
watch(props, () => {
  modelValue.value = props.modelValue;
});

// modelValue가 바뀔 때(컴포넌트 내부에서 값이 바뀔 때)
watch(modelValue, () => {
  emit("update:modelValue", modelValue.value);
});

function makeClaimTxt(element: any) {
  let returnTxt = "";
  let bodyTxt = element.body;
  if (!showNumber.value) {
    bodyTxt = Util.showOnlyNameInAutocompletedElement(bodyTxt);
  }
  if (Util.isKIPO(stores)) {
    returnTxt = returnTxt + element.quotationTxt;
    returnTxt = returnTxt + bodyTxt;
    returnTxt = returnTxt + element.category;
  }

  if (Util.isJPO(stores)) {
    returnTxt = returnTxt + bodyTxt;
    let tempTxt = element.quotationTxt + element.category;
    tempTxt = tempTxt.replace("</p><p>", "");
    returnTxt = returnTxt + tempTxt;
  }

  if (Util.isUSPTO(stores)) {
    returnTxt = returnTxt + element.category;
    returnTxt = returnTxt + element.quotationTxt;
    returnTxt = returnTxt.replace("</p><p>", " ");
    // transition 일단 사용 안하고 서비스 개시
    // returnTxt = returnTxt + element.transition;
    returnTxt = returnTxt + bodyTxt;
    returnTxt = returnTxt.replace("</p><p>", " ");
  }
  return returnTxt;
}

// 청구항 작성기 위치 잡는 로직
watch(claimWizardModal, () => {
  if (workspaceStore.claimWizardModal.isOpen) setClaimWizardLeft();
});

// 청구항 작성기 위치 버튼 눌렀을 때
watch(isClaimWizardDockLeft, () => {
  if (workspaceStore.claimWizardModal.isOpen) setClaimWizardLeft();
});

// 마법사에서 "인용항만 보기" 컨트롤
watch(workspaceStore, () => {
  if (
    workspaceStore.claimWizardModal.isOpen &&
    workspaceStore.displayOnlyParents
  ) {
    // 한번에 바꾸는 걸로 했더니 렌더링 한번에 해서 보여주는데 딜레이가 좀 있어서 그냥 바로 뿌려줌
    for (let i = 0; i < workspaceStore.caseData.claims.length; i++) {
      if (
        workspaceStore.parentArray.includes(
          workspaceStore.caseData.claims[i].claimNumber
        )
      ) {
        workspaceStore.caseData.claims[i].fold = false;
        workspaceStore.caseData.claims[i].show = true;
      } else {
        workspaceStore.caseData.claims[i].show = false;
      }
    }
  } else if (
    workspaceStore.claimWizardModal.isOpen &&
    !workspaceStore.displayOnlyParents
  ) {
    for (let i = 0; i < workspaceStore.caseData.claims.length; i++) {
      workspaceStore.caseData.claims[i].show = true;
    }
  }

  if (workspaceStore.isWizardClosing) {
    workspaceStore.isWizardClosing = false;
    for (let i = 0; i < workspaceStore.caseData.claims.length; i++) {
      workspaceStore.caseData.claims[i].show = true;
    }
  }
});

// 넘버 보기 상태 변경하면 설정값 업데이트
watch(showNumber, () => {
  if (isMounted.value) {
    // 레이아웃 설정값 업데이트
    workspaceStore.setSettingOption("SETTING/DRAFT/CLAIM_SHOW_NUMBER");
    if (showNumber.value) workspaceStore.setSettingValue("Y");
    else workspaceStore.setSettingValue("N");
    workspaceStore.requestUpdateSetting = true;
  }
});
</script>

<style lang="scss" scoped>
@import "@/styles/draft/text";

.claims {
  position: relative;
  width: 100%;
  overflow-x: hidden;
  background-color: white;
  border: 0.0625rem solid #dfdfdf;
  .claims-header {
    height: 1.5rem;
    white-space: nowrap;
  }
  .claims-body {
  }

  .claims-content {
    overflow: overlay;
    position: relative;
    height: calc(100% - 6.6rem);
  }
  &-add-btn {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 3.375rem;
    background-color: white;
    font-weight: bold;
    font-size: 0.875rem;
  }
  .claims-magition-options {
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    padding: 0.5rem 1rem;
    position: absolute;
    width: max-content;
    height: max-content;
    top: 2.25rem;
    z-index: 2;
    border-radius: 0.25rem;
    background-color: white;
    box-shadow: 0rem 0.25rem 0.25rem rgba(0, 0, 0, 0.25);
    li {
      display: flex;
      align-content: center;
      justify-content: center;

      height: 2.25rem;

      text-align: center;
      line-height: 2.25rem;
      &:hover {
        opacity: 0.8;
      }
    }
  }
}
.claim-select-btn {
  width: 2rem;
  height: 2rem;
  color: white;
  text-align: center;
  line-height: 2rem;
  border-radius: 0.25rem;
  cursor: pointer;
}
.claim-card {
  width: 100%;
  height: max-content;
  word-break: break-all;
}
</style>
