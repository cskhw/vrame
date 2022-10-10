<template>
  <div
    class="basics d-flex flex-column"
    :style="{
      backgroundColor: stores.ts.isDarkmode ? '#1e1e1e' : '',
      border: stores.ts.isDarkmode ? '0.0625rem solid #414141' : '',
      height: $route.path.includes('wtab') ? '100%' : 'calc(100% - 0.5rem)',
    }"
    style="min-width: 17.5rem"
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

    <!-- 기본영역 헤더 -->
    <div
      class="basics-header d-flex justify-space-between ma-3"
      v-init-basics-header
    >
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
          :style="{ color: stores.ts.isDarkmode ? 'white' : '' }"
        >
          {{ Util.getI18NTxt(stores, "I18N/WORKSPACE/BASIC/TITLE") }}
        </div>
        <IconBtn
          v-if="!isShowFoldingMenu"
          class="mt-1 ml-2"
          color="#9e9e9e"
          :icon="mdiMenuDown"
          @mouseover="isHoverTitleDownIcon = true"
          @mouseleave="isHoverTitleDownIcon = false"
          ><div v-if="isHoverTitleDownIcon" class="basics-header-options">
            <ul>
              <!-- 모두 접기 -->
              <li
                v-if="!isShowFoldingMenu"
                class="text-400-14-black justify-start"
                @click="
                  foldAll(false);
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
                  foldAll(true);
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
        <IconBtn
          v-if="isShowFoldingMenu"
          :icon="mdiArrowCollapseVertical"
          color="#9E9E9E"
          @click="foldAll(false)"
        />
        <IconBtn
          v-if="isShowFoldingMenu"
          :icon="mdiArrowExpandVertical"
          color="#9E9E9E"
          @click="foldAll(true)"
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
    <Divider
      height="0.0625rem"
      :bdColor="stores.ts.isDarkmode ? '#414141' : '#DFDFDF'"
    />
    <div class="basics-body">
      <Draggable
        class="basics-body"
        v-model="workspaceStore.basicCardData"
        item-key="title"
        handle=".handleBasic"
        @drag.stop=""
        @dragstart.stop=""
        @dragend.stop=""
      >
        <template #item="{ element, index }">
          <div
            v-if="element.show"
            class="basic-card"
            :item="element"
            :key="element.title"
            :style="{
              color: stores.ts.isDarkmode ? 'white' : '',
              backgroundColor: basicCardHoverColor(index),
            }"
            @clickEditBtn="openBasicEditModal(index, element)"
            @mouseenter="basicHoverIndices[index] = true"
            @mouseleave="basicHoverIndices[index] = false"
            @drag="onDragBasicCard"
            @dragend="onDragEndBasicCard"
          >
            <!-- 베이직 카드 헤더 -->
            <div class="d-flex justify-space-between pa-3">
              <div class="d-flex align-center">
                <IconBtn
                  color="grey"
                  class="handleBasic mr-2"
                  :icon="mdiReorderHorizontal"
                />
                <div
                  v-if="element.id === 'invention_title'"
                  class="text-400-14-black"
                  :style="{
                    fontFamily: workspaceStore.fontFamily,
                    fontSize: workspaceStore.fontSize,
                    color: stores.ts.isDarkmode ? 'white' : '#212121',
                  }"
                  v-html="
                    Util.isPCT(stores)
                      ? Util.getI18NTxt(
                          stores,
                          'I18N/WORKSPACE/BASIC/INVENTION_TITLE_PCT'
                        )
                      : Util.getI18NTxt(
                          stores,
                          'I18N/WORKSPACE/BASIC/INVENTION_TITLE'
                        )
                  "
                />
                <div
                  v-if="element.id === 'cross_reference'"
                  class="text-400-14-black"
                  :style="{
                    fontFamily: workspaceStore.fontFamily,
                    fontSize: workspaceStore.fontSize,
                    color: stores.ts.isDarkmode ? 'white' : '#212121',
                  }"
                  v-html="
                    Util.getI18NTxt(
                      stores,
                      'I18N/WORKSPACE/BASIC/CROSS_REFERENCE'
                    )
                  "
                />
                <div
                  v-if="element.id === 'technical_field'"
                  class="text-400-14-black"
                  :style="{
                    fontFamily: workspaceStore.fontFamily,
                    fontSize: workspaceStore.fontSize,
                    color: stores.ts.isDarkmode ? 'white' : '#212121',
                  }"
                  v-html="
                    Util.isPCT(stores)
                      ? Util.getI18NTxt(
                          stores,
                          'I18N/WORKSPACE/BASIC/TECHNICAL_FIELD_PCT'
                        )
                      : Util.getI18NTxt(
                          stores,
                          'I18N/WORKSPACE/BASIC/TECHNICAL_FIELD'
                        )
                  "
                />
                <div
                  v-if="element.id === 'background'"
                  class="text-400-14-black"
                  :style="{
                    fontFamily: workspaceStore.fontFamily,
                    fontSize: workspaceStore.fontSize,
                    color: stores.ts.isDarkmode ? 'white' : '#212121',
                  }"
                  v-html="
                    Util.isPCT(stores)
                      ? Util.getI18NTxt(
                          stores,
                          'I18N/WORKSPACE/BASIC/BACKGROUND_PCT'
                        )
                      : Util.getI18NTxt(
                          stores,
                          'I18N/WORKSPACE/BASIC/BACKGROUND'
                        )
                  "
                />
                <div
                  v-if="element.id === 'prior_art'"
                  class="text-400-14-black"
                  :style="{
                    fontFamily: workspaceStore.fontFamily,
                    fontSize: workspaceStore.fontSize,
                    color: stores.ts.isDarkmode ? 'white' : '#212121',
                  }"
                  v-html="
                    Util.getI18NTxt(stores, 'I18N/WORKSPACE/BASIC/PRIOR_ART')
                  "
                />
                <div
                  v-if="element.id === 'purpose'"
                  class="text-400-14-black"
                  :style="{
                    fontFamily: workspaceStore.fontFamily,
                    fontSize: workspaceStore.fontSize,
                    color: stores.ts.isDarkmode ? 'white' : '#212121',
                  }"
                  v-html="
                    Util.isPCT(stores)
                      ? Util.getI18NTxt(
                          stores,
                          'I18N/WORKSPACE/BASIC/PURPOSE_PCT'
                        )
                      : Util.getI18NTxt(stores, 'I18N/WORKSPACE/BASIC/PURPOSE')
                  "
                />
                <div
                  v-if="element.id === 'advantages'"
                  class="text-400-14-black"
                  :style="{
                    fontFamily: workspaceStore.fontFamily,
                    fontSize: workspaceStore.fontSize,
                    color: stores.ts.isDarkmode ? 'white' : '#212121',
                  }"
                  v-html="
                    Util.isPCT(stores)
                      ? Util.getI18NTxt(
                          stores,
                          'I18N/WORKSPACE/BASIC/ADVANTAGE_PCT'
                        )
                      : Util.getI18NTxt(
                          stores,
                          'I18N/WORKSPACE/BASIC/ADVANTAGE'
                        )
                  "
                />
                <div
                  v-if="element.id === 'drawings_description'"
                  class="text-400-14-black"
                  :style="{
                    fontFamily: workspaceStore.fontFamily,
                    fontSize: workspaceStore.fontSize,
                    color: stores.ts.isDarkmode ? 'white' : '#212121',
                  }"
                  v-html="
                    Util.isPCT(stores)
                      ? Util.getI18NTxt(stores, 'I18N/WORKSPACE/BASIC/DRAWINGS')
                      : Util.getI18NTxt(stores, 'I18N/WORKSPACE/BASIC/DRAWINGS')
                  "
                />
                <div
                  v-if="element.id === 'summary'"
                  class="text-400-14-black"
                  :style="{
                    fontFamily: workspaceStore.fontFamily,
                    fontSize: workspaceStore.fontSize,
                    color: stores.ts.isDarkmode ? 'white' : '#212121',
                  }"
                  v-html="
                    Util.getI18NTxt(stores, 'I18N/WORKSPACE/BASIC/SUMMARY')
                  "
                />
                <div
                  v-if="element.id === 'industrial_applicability'"
                  class="text-400-14-black"
                  :style="{
                    fontFamily: workspaceStore.fontFamily,
                    fontSize: workspaceStore.fontSize,
                    color: stores.ts.isDarkmode ? 'white' : '#212121',
                  }"
                  v-html="
                    Util.getI18NTxt(
                      stores,
                      'I18N/WORKSPACE/BASIC/INDUSTRIAL_APPLICABILITY'
                    )
                  "
                />
                <div
                  v-if="element.id === 'sequencelist'"
                  class="text-400-14-black"
                  :style="{
                    fontFamily: workspaceStore.fontFamily,
                    fontSize: workspaceStore.fontSize,
                    color: stores.ts.isDarkmode ? 'white' : '#212121',
                  }"
                  v-html="
                    Util.getI18NTxt(stores, 'I18N/WORKSPACE/BASIC/SEQUENCELIST')
                  "
                />
              </div>
              <div class="d-flex">
                <v-btn
                  v-if="
                    !isReadonlyWindow &&
                    basicHoverIndices[index] &&
                    checkDataLength(element) &&
                    !workspaceStore.claimWizardModal.isOpen
                  "
                  class="pa-0 px-3 mr-1"
                  :color="basicCardWriteTxtColor"
                  style="color: white"
                  flat
                  :style="{
                    height: '1.5rem',
                    fontSize: '0.75rem',
                    minWidth: '2rem',
                  }"
                  @click="openBasicEditModal(index, element)"
                  >{{ Util.getI18NTxt(stores, "I18N/BUTTON/EDIT") }}</v-btn
                >
                <IconBtn
                  color="#9E9E9E"
                  :icon="element.fold === false ? mdiChevronUp : mdiChevronDown"
                  @click="fold(element)"
                />
              </div>
            </div>
            <!-- 베이직 카드 컨텐츠 -->
            <div
              v-if="!element.fold"
              class="d-flex flex-column align-center"
              :style="{
                fontFamily: workspaceStore.fontFamily,
                fontSize: workspaceStore.fontSize,
                color: stores.ts.isDarkmode ? 'white' : '',
                textIndent:
                  Util.getSettingValue(stores, 'SETTING/EDITOR/AUTO_INDENT') ===
                  'Y'
                    ? '2rem'
                    : '0rem',
                lineHeight: Util.getSettingValue(
                  stores,
                  'SETTING/EDITOR/LINE_HEIGHT'
                ),
              }"
            >
              <!-- 발명의 명칭 -->
              <div
                v-if="element.id === 'invention_title'"
                class="pl-3 pr-3 pb-3"
                style="width: 100%; text-align: justify"
                v-html="
                  Util.isKIPO(stores)
                    ? Util.removePTag(
                        workspaceStore.caseData.invention_title.data
                      ) +
                      ' {' +
                      Util.removePTag(
                        workspaceStore.caseData.invention_title.data_sub
                      ) +
                      '}'
                    : Util.removePTag(
                        workspaceStore.caseData.invention_title.data
                      )
                "
              ></div>
              <!-- 상호 참조 -->
              <div
                v-if="
                  element.id === 'cross_reference' && checkDataLength(element)
                "
                class="pl-3 pr-3 pb-3"
                style="width: 100%; text-align: justify"
                v-html="
                  makeDisplayTxt(workspaceStore.caseData.cross_reference.data)
                "
              ></div>
              <div
                v-if="
                  element.id === 'technical_field' && checkDataLength(element)
                "
                class="pl-3 pr-3 pb-3"
                style="width: 100%; text-align: justify"
                v-html="
                  makeDisplayTxt(workspaceStore.caseData.technical_field.data)
                "
              ></div>
              <!-- 배경 기술 -->
              <div
                v-if="element.id === 'background' && checkDataLength(element)"
                class="pl-3 pr-3 pb-3"
                style="width: 100%; text-align: justify"
                v-html="makeDisplayTxt(workspaceStore.caseData.background.data)"
              ></div>
              <!-- 선행 기술 -->
              <div
                v-if="element.id === 'prior_art' && checkDataLength(element)"
                class="pl-3 pr-3 pb-3"
                style="width: 100%; text-align: justify"
                v-html="makeDisplayTxt(workspaceStore.caseData.prior_art.data)"
              ></div>
              <!-- 해결하고자 하는 과제 -->
              <div
                v-if="element.id === 'purpose' && checkDataLength(element)"
                class="pl-3 pr-3 pb-3"
                style="width: 100%; text-align: justify"
                v-html="makeDisplayTxt(workspaceStore.caseData.purpose.data)"
              ></div>
              <!-- 발명의 효과 -->
              <div
                v-if="element.id === 'advantages' && checkDataLength(element)"
                class="pl-3 pr-3 pb-3"
                style="width: 100%; text-align: justify"
                v-html="makeDisplayTxt(workspaceStore.caseData.advantages.data)"
              ></div>
              <!-- 도면의 간단한 설명 -->
              <div
                v-if="
                  element.id === 'drawings_description' &&
                  checkDataLength(element)
                "
                class="pl-3 pr-3 pb-3"
                style="width: 100%; text-align: justify"
                v-html="
                  makeDisplayTxt(
                    workspaceStore.caseData.drawing_description.data
                  )
                "
              ></div>
              <!-- summary -->
              <div
                v-if="element.id === 'summary' && checkDataLength(element)"
                class="pl-3 pr-3 pb-3"
                style="width: 100%; text-align: justify"
                v-html="makeDisplayTxt(workspaceStore.caseData.summary.data)"
              ></div>
              <!-- 산업상 이용 가능성 -->
              <div
                v-if="
                  element.id === 'industrial_applicability' &&
                  checkDataLength(element)
                "
                class="pl-3 pr-3 pb-3"
                style="width: 100%; text-align: justify"
                v-html="
                  makeDisplayTxt(
                    workspaceStore.caseData.industrial_applicability.data
                  )
                "
              ></div>
              <!-- 서열목록 프리텍스트 -->
              <div
                v-if="element.id === 'sequencelist' && checkDataLength(element)"
                class="pl-3 pr-3 pb-3"
                style="width: 100%; text-align: justify"
                v-html="
                  makeDisplayTxt(workspaceStore.caseData.sequencelist.data)
                "
              ></div>
              <!-- 작성하기 버튼 -->
              <div
                v-if="
                  !isReadonlyWindow &&
                  !checkDataLength(element) &&
                  !workspaceStore.claimWizardModal.isOpen
                "
                class="basic-card-write-txt pb-3 text-bold-14-black"
                :style="{ color: basicCardWriteTxtColor }"
                @click="openBasicEditModal(index, element)"
              >
                {{
                  Util.getI18NTxt(stores, "I18N/WORKSPACE/BASIC/DRAFT_BUTTON")
                }}
              </div>
              <!-- 청구항 작성기 모달이 떠 있거나, 새탭에서 보는 상태이면 작성하기 버튼 안보임 -->
              <div
                v-if="
                  !checkDataLength(element) &&
                  (workspaceStore.claimWizardModal.isOpen || isReadonlyWindow)
                "
                class="pb-3 text-bold-14-black"
                style="
                  width: 100%;
                  color: #5c6bc0;
                  cursor: pointer;
                  text-align: center;
                "
              >
                -
              </div>
            </div>
            <Divider
              height="0.0625rem"
              :bdColor="stores.ts.isDarkmode ? '#414141' : '#DFDFDF'"
            />
          </div>
        </template>
      </Draggable>
    </div>

    <!-- 데이터 수정을 위한 모달 영역 -->
    <teleport to="#modal-area">
      <DragModal
        ref="basicEditModal"
        :title="setModalTitle(basicItem?.id)"
        buttonType="NY"
        :noTxt="Util.getI18NTxt(stores, 'I18N/BUTTON/CLOSE')"
        :noFunc="closeBasicEditModal"
        :yesTxt="Util.getI18NTxt(stores, 'I18N/BUTTON/SAVE')"
        :yesFunc="asyncSaveBasicDataSpinner"
        :closeFunc="closeBasicEditModal"
        opacity-bar
        closeBtn
        v-init-basic-edit-modal
      >
        <!-- 발명의 명칭 입력 모달 -->
        <template v-if="basicItem?.id === 'invention_title'">
          <div :style="{ width: '37rem' }"></div>
          <div class="d-flex mb-2">
            <div
              v-if="Util.isKIPO(stores)"
              class="d-flex align-center"
              :style="{ color: themeStore.isDarkmode ? 'white' : '#212121' }"
              style="width: 3.125rem"
            >
              한글 :
            </div>
            <div class="editor-wrapper" style="position: relative; width: 100%">
              <div
                id="invention-title-toolbar"
                style="position: absolute; top: -2.5625rem; left: 10.5rem"
              />
              <Editor
                inline
                id="invention-title"
                :data="inventionTitle.data"
                :init="{
                  ...workspaceStore.tinymceInlineConfig,
                  placeholder: Util.getI18NTxt(
                    stores,
                    'I18N/WORKSPACE/BASIC/INVENTION_TITLE'
                  ),
                  fixed_toolbar_container: '#invention-title-toolbar',
                  setup: handleDataEnter,
                  callback: editorInitCallback,
                }"
                :style="[
                  inlineEditorStyle,
                  {
                    minWidth: '5rem',
                    padding: '0.625rem 0.625rem 0.625rem 0.625rem',
                  },
                ]"
              />
            </div>
          </div>
          <div v-if="Util.isKIPO(stores)" class="d-flex">
            <div
              class="d-flex align-center text-400-14-black"
              :style="{ color: themeStore.isDarkmode ? 'white' : '#212121' }"
              style="width: 3.125rem"
            >
              영어 :
            </div>
            <div class="editor-wrapper" style="position: relative; width: 100%">
              <div
                id="invention-title2-toolbar"
                style="position: absolute; top: -2.5625rem; left: 10.5rem"
              />
              <Editor
                inline
                id="invention-title2"
                :data="inventionTitle.data_sub"
                :init="{
                  ...workspaceStore.tinymceInlineConfig,
                  placeholder: Util.getI18NTxt(
                    stores,
                    'I18N/WORKSPACE/BASIC/INVENTION_TITLE'
                  ),
                  fixed_toolbar_container: '#invention-title2-toolbar',

                  setup: handleDataSubEnter,
                  callback: titleEditorInitCallback,
                }"
                :style="[
                  inlineEditorStyle,
                  {
                    minWidth: '5rem',
                    padding: '0.625rem 0.625rem 0.625rem 0.625rem',
                  },
                ]"
              />
            </div>
          </div>
        </template>
        <!-- 도면의 간단한 설명 입력 모달 -->
        <template v-else-if="basicItem?.id === 'drawings_description'">
          <div
            class="drawings-desc-modal-content"
            style="height: 36.25rem"
            :style="{
              borderTop: themeStore.darkmodeBorder,
            }"
          >
            <div
              :style="{
                borderRight: themeStore.darkmodeBorder,
                width: '35rem',
              }"
              d
            >
              <!-- 도면 컨텐츠 -->
              <div
                class="basics-drawings-content d-flex flex-column justify-start align-center"
              >
                <!-- 도면이 없을 때 -->
                <div
                  class="drawing-no-files d-flex flex-column justify-center align-center"
                  v-if="!drawingFiles?.length"
                >
                  <div class="text-400-14-gray mb-2">
                    {{
                      Util.getI18NTxt(
                        stores,
                        "I18N/WORKSPACE/DRAWINGS/REQUEST_UPLOAD"
                      )
                    }}
                  </div>
                </div>
                <!-- 도면이 있을 때 -->
                <div
                  class="drawings-files d-flex flex-column justify-start align-center"
                  v-else
                >
                  <!-- 도면 이미지 -->
                  <img
                    v-if="isSrcImg"
                    class="drawings-image"
                    alt="drawings"
                    style="height: 25rem; object-fit: contain"
                    :src="drawingFiles[curDrawingIdx].data"
                  />
                  <!-- 도면 pdfobject -->
                  <div
                    v-else
                    id="drawings-modal-pdf"
                    class="drawings-pdf d-flex justify-center align-center"
                  ></div>
                  <div
                    class="drawings-image-name mt-2"
                    :style="{ color: themeStore.darkmodeColor }"
                  >
                    {{ drawingFiles[curDrawingIdx]?.name }}
                  </div>

                  <Draggable
                    v-if="isSrcImg"
                    v-model="drawingFiles"
                    class="d-flex flex-wrap mt-8 mx-2"
                    style="gap: 0.5rem"
                    item-key="name"
                  >
                    <!-- 도면 인덱스 -->
                    <template #item="{ element, index }">
                      <div
                        class="drawings-idx-btn"
                        :key="element.name"
                        :style="{
                          backgroundColor: drawingIdxBgColor(index),
                          color: drawingIdxBtnColor(index),
                          border: drawingIdxBorderColor(index),
                        }"
                        @click="onClickDrawingIdxBtn(index)"
                        draggable="true"
                      >
                        {{ index + 1 }}
                      </div>
                    </template>
                  </Draggable>
                </div>
              </div>
            </div>
            <div v-if="tempDrawingDescription.draftType === 'list'">
              <Draggable
                v-model="tempDrawingDescription.list"
                item-key="index"
                handle=".handle"
                :style="{
                  width: '35rem',
                  borderLeft: themeStore.darkmodeBorder,
                  whiteSpace: 'nowrap',
                  position: 'relative',
                }"
                @change="drawingMoved($event)"
              >
                <template #item="{ element, index }">
                  <div
                    :key="index"
                    class="d-flex align-center pl-2 py-1"
                    :style="{ borderBottom: themeStore.darkmodeBorder }"
                    @mouseenter="isHoverBasicEditModalCards[index] = true"
                    @mouseleave="isHoverBasicEditModalCards[index] = false"
                  >
                    <div
                      class="d-flex pr-6 text-400-14-black"
                      style="width: 6.25rem"
                    >
                      <IconBtn
                        class="mr-2 handle"
                        :icon="mdiReorderHorizontal"
                        color="gray"
                      />
                      <span :style="{ color: themeStore.darkmodeColor }">
                        {{
                          Util.getI18NTxt(
                            stores,
                            "I18N/WORKSPACE/BASIC/DRAWING_UNIT_PART1"
                          ).replace("$NUMBER$", index + 1 + "")
                        }}{{
                          userStore.getLang === "UI_LANGUAGE/KO"
                            ? Util.setJosa(index + 1 + "", "은")
                            : userStore.getLang === "UI_LANGUAGE/JA"
                            ? "は"
                            : userStore.getLang === "UI_LANGUAGE/EN"
                            ? " is"
                            : ""
                        }}
                      </span>
                    </div>
                    <!-- 도면별 설명 입력 -->
                    <div
                      class="editor-wrapper"
                      style="position: relative; width: 100%"
                    >
                      <div
                        :id="'drawing-description' + (index + 1) + 'toolbar'"
                        style="position: absolute; top: -2.625rem"
                      />
                      <Editor
                        inline
                        :id="'drawing-description' + (index + 1)"
                        :data="element.description"
                        :init="{
                          ...workspaceStore.tinymceInlineConfig,
                          setup: drawingDescriptionEditorSetup,
                          fixed_toolbar_container:
                            '#drawing-description' + (index + 1) + 'toolbar',
                        }"
                        :style="[
                          inlineEditorStyle,
                          {
                            minWidth: '5rem',
                            padding: '0.625rem 0.625rem 0.625rem 0.625rem',
                          },
                        ]"
                        useAutocomplete
                        doNotUseAutoCapitalize
                      />
                    </div>
                    <IconBtn
                      v-if="index !== 0 && isHoverBasicEditModalCards[index]"
                      class="ml-2"
                      :icon="mdiTrashCan"
                      color="gray"
                      @click="deleteDrawing(index)"
                    />
                  </div>
                </template>
              </Draggable>
              <div
                class="d-flex justify-center align-center"
                style="height: 3.375rem"
                :style="{
                  borderTop: themeStore.darkmodeBorder,
                }"
              >
                <div
                  class="pl-3 text-400-14-black"
                  style="width: 70%; text-align: left"
                >
                  {{
                    Util.getI18NTxt(
                      stores,
                      "I18N/WORKSPACE/BASIC/DRAWING_NUMBER_AUTOCHANGE"
                    )
                  }}
                </div>
                <div
                  class="drawing-add-btn d-flex justify-end align-center"
                  style="width: 30%"
                  @click="addDrawing()"
                >
                  <IconBtn
                    class="mr-2"
                    :color="Util.getColor(stores, 'BUTTON')"
                    :icon="mdiPlusCircle"
                    width="1.875rem"
                    height="1.875rem"
                  />
                  <div class="text-400-14-black" style="color: #9e9e9e">
                    {{
                      Util.getI18NTxt(
                        stores,
                        "I18N/WORKSPACE/BASIC/DRAWING_ADD_BUTTON"
                      )
                    }}
                  </div>
                </div>
              </div>
            </div>
            <!-- 도면 설명 통합 입력 -->
            <div v-else>
              <Editor
                id="basic-editor"
                :data="basicItem.desc"
                :init="{
                  ...workspaceStore.tinymceConfig,
                  setup: editorSetup,
                  callback: editorInitCallback,
                }"
                :style="[
                  { width: '35rem', height: '100%', padding: '0.625rem' },
                ]"
                useAutocomplete
              />
            </div>
          </div>
          <v-btn
            v-if="tempDrawingDescription.draftType === 'list'"
            flat
            :style="{
              position: 'absolute',
              bottom: '1rem',
              backgroundColor: themeStore.darkmodeBackgroundColor,
              border: '1px solid ' + Util.getColor(stores, 'BUTTON'),
              color: Util.getColor(stores, 'BUTTON'),
              fontWeight: '400',
              fontSize: '0.875rem',
            }"
            @click="changeDraftMode"
            >{{
              Util.getI18NTxt(
                stores,
                "I18N/WORKSPACE/BASIC/DRAWING_CHANGE_DRAFT_MODE"
              )
            }}</v-btn
          >
        </template>
        <!-- 기술분야 등 다른 분야 입력 모달 -->
        <template v-else>
          <div :style="{ width: '37rem' }">
            <Editor
              id="basic-editor"
              :data="basicItem.desc"
              :init="{
                ...workspaceStore.tinymceConfig,
                setup: editorSetup,
                callback: editorInitCallback,
              }"
              :style="[{ height: basicItem.height, padding: '0.625rem' }]"
              useAutocomplete
            />
          </div>
          <div
            v-if="onCircular"
            class="d-flex justify-center align-center"
            style="
              position: absolute;
              width: 100%;
              height: 100%;
              left: 0;
              top: 0;
              background: white;
              z-index: 10000;
            "
            :style="{
              backgroundColor: stores.ts.darkmodeBackgroundColor,
            }"
          >
            <v-progress-circular
              indeterminate
              color="#5c6bc0"
              width="7"
              :size="50"
            />
          </div>
        </template>
        <IComponentSpinner
          ref="modalSpinner"
          :container-style="{ width: 'calc(100% - 2rem)' }"
        />
      </DragModal>
    </teleport>
  </div>
</template>

<script lang="ts" setup>
import * as Util from "@/assets/javascripts/ipedit_util";
import type { AxiosError } from "axios";
import { rgbToRgba } from "@/assets/javascripts/utils/css";
import IconBtn from "@/components/common/IconBtn.vue";
import DragModal from "@/components/common/modal/DragModal.vue";
import Divider from "@/components/Divider.vue";
import CommonSwitch from "@/components/common/Switch.vue";
import Editor from "@/components/workspace/Editor.vue";
// 스토어 import
import useAppStore from "@/store/useAppStore";
import useI18NStore from "@/store/useI18NStore";
import useModalStore from "@/store/useModalStore";
import useThemeStore from "@/store/useThemeStore";
import useUserStore from "@/store/useUserStore";
import useWorkspaceStore from "@/store/useWorkspaceStore";
import {
  mdiArrowCollapseVertical,
  mdiArrowExpandVertical,
  mdiClose,
  mdiNumeric,
  mdiReorderHorizontal,
  mdiReorderVertical,
  mdiTrashCan,
  mdiPlusCircle,
  mdiChevronDown,
  mdiChevronUp,
  mdiOpenInNew,
  mdiMenuDown,
} from "@mdi/js";
import { inlineEditorStyle } from "@/styles/index";
import {
  ref,
  watch,
  onBeforeMount,
  onMounted,
  type Directive,
  computed,
} from "vue";
import Draggable from "vuedraggable";
import tinymce from "tinymce/tinymce";
import type { Editor as EditorType } from "tinymce/tinymce";
import type { DrawingData, DrawingDescriptionData } from "@/types/case";
import type { ModalType } from "@/types/modal";
import PDFObject from "pdfobject";
import { useRouter } from "vue-router";
import { tldexie } from "@/assets/javascripts/dexie";
import { asyncDebounce } from "@/assets/javascripts/utils/asyncDebounce";
import IComponentSpinner from "@/components/IComponentSpinner.vue";
import type { IIComponentSpinner } from "@/types/component";

const props = defineProps<{
  modelValue?: boolean;
}>();
const emit = defineEmits(["update:modelValue"]);
const modelValue = ref(props.modelValue);

const appStore = useAppStore();
const userStore = useUserStore();
const modalStore = useModalStore();
const i18nStore = useI18NStore();
const themeStore = useThemeStore();
const workspaceStore = useWorkspaceStore();

const router = useRouter();

const stores = {
  as: appStore,
  us: userStore,
  ms: modalStore,
  is: i18nStore,
  ts: themeStore,
  ws: workspaceStore,
};

const isMounted = ref(false);
const onCircular = ref(false);

const basicHoverIndices = ref<boolean[]>([]);

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

/**청구항 헤더 */
// 청구항 헤더 드롭다운 메뉴 플래그
const isHoverTitleDownIcon = ref(false);
const isShowFoldingMenu = ref(false);

function closeArea() {
  if (!isReadonlyWindow.value) {
    workspaceStore.controlAreaShow("basic");
    workspaceStore.initializeToolbar = true;
  } else {
    window.close();
  }
}

// 번호 표시 여부
const showNumber = ref<boolean>(true);
// 새탭 열기 버튼 클릭 시
function onClickOpenNewTabBtn() {
  localStorage.setItem("tabFrom", "basics");
  window.open(
    "wtab",
    "basics",
    `width=${Math.ceil(window.screen.availWidth / 2)}, height=${
      window.screen.availHeight
    }, menubar=no, status=no, toolbar=no, location=no`
  );
}

// 레이아웃 변수
// const drawingsLength = ref("10");
const isBasicCardDrag = ref(false);
const isComponentDrag = ref(false);

const basicEditModal = ref<ModalType>();
const basicItem = ref({
  id: "",
  height: "",
  fold: false,
  show: true,
  desc: "",
});

const inventionTitle = ref({
  data: "",
  data_sub: "",
});

// 도면의 간단한 설명 리스트 입력 컨트롤용 셋팅
const isHoverBasicEditModalCards = ref<boolean[]>([]);
// const drawingsDescItems = ref([{ number: 1, parentNumber: 0, desc: "" }]);
// for (let i = 0; i < drawingsDescItems.value.length; i++) {
//   isHoverBasicEditModalCards.value.push(false);
// }

// 도면의 설명 리스트 관리를 위한 임시 변수
const tempDrawingDescription = ref({
  draftType: "list",
  list: [] as DrawingDescriptionData[],
  data: "",
});

function setModalTitle(id: string) {
  if (id == "invention_title")
    if (Util.isPCT(stores))
      return Util.getI18NTxt(
        stores,
        "I18N/WORKSPACE/BASIC/INVENTION_TITLE_PCT"
      );
    else return Util.getI18NTxt(stores, "I18N/WORKSPACE/BASIC/INVENTION_TITLE");

  if (id == "cross_reference")
    return Util.getI18NTxt(stores, "I18N/WORKSPACE/BASIC/CROSS_REFERENCE");

  if (id == "technical_field")
    if (Util.isPCT(stores))
      return Util.getI18NTxt(
        stores,
        "I18N/WORKSPACE/BASIC/TECHNICAL_FIELD_PCT"
      );
    else return Util.getI18NTxt(stores, "I18N/WORKSPACE/BASIC/TECHNICAL_FIELD");

  if (id == "background")
    if (Util.isPCT(stores))
      return Util.getI18NTxt(stores, "I18N/WORKSPACE/BASIC/BACKGROUND_PCT");
    else return Util.getI18NTxt(stores, "I18N/WORKSPACE/BASIC/BACKGROUND");

  if (id == "prior_art")
    return Util.getI18NTxt(stores, "I18N/WORKSPACE/BASIC/PRIOR_ART");

  if (id == "purpose")
    if (Util.isPCT(stores))
      return Util.getI18NTxt(stores, "I18N/WORKSPACE/BASIC/PURPOSE_PCT");
    else return Util.getI18NTxt(stores, "I18N/WORKSPACE/BASIC/PURPOSE");

  if (id == "advantages")
    if (Util.isPCT(stores))
      return Util.getI18NTxt(stores, "I18N/WORKSPACE/BASIC/ADVANTAGE_PCT");
    else return Util.getI18NTxt(stores, "I18N/WORKSPACE/BASIC/ADVANTAGE");

  if (id == "drawings_description")
    if (Util.isPCT(stores))
      return Util.getI18NTxt(stores, "I18N/WORKSPACE/BASIC/DRAWINGS_PCT");
    else return Util.getI18NTxt(stores, "I18N/WORKSPACE/BASIC/DRAWINGS");

  if (id == "summary")
    return Util.getI18NTxt(stores, "I18N/WORKSPACE/BASIC/SUMMARY");

  if (id == "industrial_applicability")
    return Util.getI18NTxt(
      stores,
      "I18N/WORKSPACE/BASIC/INDUSTRIAL_APPLICABILITY"
    );

  if (id == "sequencelist")
    return Util.getI18NTxt(stores, "I18N/WORKSPACE/BASIC/SEQUENCELIST");
}

function makeDisplayTxt(data: string) {
  let returnTxt = data;
  if (!showNumber.value) {
    returnTxt = Util.showOnlyNameInAutocompletedElement(returnTxt);
  }

  return returnTxt;
}

const vInitBasicsHeader = {
  // 여기서 el은 vIinitClaims가 셋팅되어 있는 div
  updated(el: HTMLElement) {
    let width = el.clientWidth;
    if (width > 280) isShowFoldingMenu.value = true;
    else isShowFoldingMenu.value = false;
  },
};

const basicCardWriteTxtColor = computed(() => {
  if (themeStore.isDarkmode) return Util.getColor(stores, "BUTTON_DARK");
  else return Util.getColor(stores, "BUTTON");
});

const basicCardHoverColor = computed(() => (index: number) => {
  if (basicHoverIndices.value[index]) return Util.getColor(stores, "TINTED");
  // else if (stores.ts.isDarkmode) return Util.getColor(stores, "TINTED_DARK");
  else if (stores.ts.isDarkmode) return themeStore.darkmodeBackgroundColor;
  else return "white";
});

async function openBasicEditModal(idx: number, item: any) {
  // 에디터 데이터가 바로 basics에 표시되는 걸 막기 위해 깊은 복사로 연결 끊어줌
  const editTarget = JSON.parse(JSON.stringify(item));
  let descTxt = "";
  if (editTarget.id === "invention_title") {
    inventionTitle.value.data = workspaceStore.caseData.invention_title.data;
    inventionTitle.value.data_sub =
      workspaceStore.caseData.invention_title.data_sub;
  }

  if (editTarget.id === "cross_reference") {
    if (
      Util.removePTag(workspaceStore.caseData.cross_reference.data).trim() ===
      ""
    ) {
      descTxt = Util.getIdiomData(stores, "DR_IDIOM/TEMPLATE/CROSS_REFERENCE");
      descTxt = Util.setUpTitleInIdiom(
        stores,
        workspaceStore.caseMasterData.format_code_path,
        descTxt
      );
      editTarget.desc = descTxt;
    } else {
      editTarget.desc = workspaceStore.caseData.cross_reference.data;
    }
  }

  if (editTarget.id === "technical_field") {
    if (
      Util.removePTag(workspaceStore.caseData.technical_field.data).trim() ===
      ""
    ) {
      descTxt = Util.getIdiomData(stores, "DR_IDIOM/TEMPLATE/TECHNICAL_FIELD");
      descTxt = Util.setUpTitleInIdiom(
        stores,
        workspaceStore.caseMasterData.format_code_path,
        descTxt
      );
      editTarget.desc = descTxt;
    } else {
      editTarget.desc = workspaceStore.caseData.technical_field.data;
    }
  }

  if (editTarget.id === "prior_art") {
    if (Util.removePTag(workspaceStore.caseData.prior_art.data).trim() === "") {
      editTarget.desc = Util.getIdiomData(
        stores,
        "DR_IDIOM/TEMPLATE/PRIOR_ART"
      );
    } else {
      editTarget.desc = workspaceStore.caseData.prior_art.data;
    }
  }

  if (editTarget.id === "background") {
    editTarget.desc = workspaceStore.caseData.background.data;
  }

  if (editTarget.id === "purpose") {
    if (Util.removePTag(workspaceStore.caseData.purpose.data).trim() === "") {
      descTxt = Util.getIdiomData(stores, "DR_IDIOM/TEMPLATE/PURPOSE");
      descTxt = Util.setUpTitleInIdiom(
        stores,
        workspaceStore.caseMasterData.format_code_path,
        descTxt
      );
      editTarget.desc = descTxt;
    } else {
      editTarget.desc = workspaceStore.caseData.purpose.data;
    }
  }

  if (editTarget.id === "advantages") {
    if (
      Util.removePTag(workspaceStore.caseData.advantages.data).trim() === ""
    ) {
      descTxt = Util.getIdiomData(stores, "DR_IDIOM/TEMPLATE/EFFECT");
      descTxt = Util.setUpTitleInIdiom(
        stores,
        workspaceStore.caseMasterData.format_code_path,
        descTxt
      );
      editTarget.desc = descTxt;
    } else {
      editTarget.desc = workspaceStore.caseData.advantages.data;
    }
  }

  if (editTarget.id === "summary") {
    if (Util.removePTag(workspaceStore.caseData.summary.data).trim() === "") {
      descTxt = Util.getIdiomData(stores, "DR_IDIOM/TEMPLATE/SUMMARY");
      descTxt = Util.setUpTitleInIdiom(
        stores,
        workspaceStore.caseMasterData.format_code_path,
        descTxt
      );
      editTarget.desc = descTxt;
    } else {
      editTarget.desc = workspaceStore.caseData.summary.data;
    }
  }

  if (editTarget.id === "industrial_applicability") {
    if (
      Util.removePTag(
        workspaceStore.caseData.industrial_applicability.data
      ).trim() === ""
    ) {
      descTxt = Util.getIdiomData(
        stores,
        "DR_IDIOM/TEMPLATE/INDUSTRIAL_APPLICABILITY"
      );
      descTxt = Util.setUpTitleInIdiom(
        stores,
        workspaceStore.caseMasterData.format_code_path,
        descTxt
      );
      editTarget.desc = descTxt;
    } else {
      editTarget.desc = workspaceStore.caseData.industrial_applicability.data;
    }
  }

  if (editTarget.id === "sequencelist") {
    if (
      Util.removePTag(workspaceStore.caseData.sequencelist.data).trim() === ""
    ) {
      descTxt = Util.getIdiomData(stores, "DR_IDIOM/TEMPLATE/SEQUENCELIST");
      descTxt = Util.setUpTitleInIdiom(
        stores,
        workspaceStore.caseMasterData.format_code_path,
        descTxt
      );
      editTarget.desc = descTxt;
    } else {
      editTarget.desc = workspaceStore.caseData.sequencelist.data;
    }
  }

  if (editTarget.id === "drawings_description") {
    tempDrawingDescription.value = JSON.parse(
      JSON.stringify(workspaceStore.caseData.drawing_description)
    );
    // 도면의 간단한 설명 작성 방식이 list인데, 데이터가 없는 경우
    if (
      Util.removePTag(tempDrawingDescription.value.data).trim() === "" &&
      tempDrawingDescription.value.draftType === "list"
    ) {
      tempDrawingDescription.value.list = [];
      tempDrawingDescription.value.list.push({
        description: "",
      });
      // console.log(drawingDescription.value.list);
    }
    // 도면의 간단한 설명 작성 방식이 list인데, 데이터가 있는 경우
    else if (
      Util.removePTag(tempDrawingDescription.value.data).trim() !== "" &&
      tempDrawingDescription.value.draftType === "list"
    ) {
      for (
        let i = 0;
        i < workspaceStore.caseData.drawing_description.list.length;
        i++
      ) {
        console.log(workspaceStore.caseData.drawing_description.list[i]);
        tinymce
          .get("drawing-description" + (i + 1))
          ?.setContent(
            workspaceStore.caseData.drawing_description.list[i].description
          );
      }
    } else {
      editTarget.desc = tempDrawingDescription.value.data;
    }
  }

  basicItem.value = editTarget;

  basicEditModal.value?.show();
}

function closeBasicEditModal() {
  basicEditModal.value?.hide();
  // workspace에 포커스를 강제로 주기 위함
  document.getElementById("hidden-input")?.focus();
}

// 도면의 간단한 설명 리스트 입력에서 도면 추가
function addDrawing() {
  // TODO: 오픈시에 아래 소스 적용
  tempDrawingDescription.value.list.push({
    description: "",
  });
}

// 도면의 간단한 설명 리스트 입력에서 도면 삭제
function deleteDrawing(index: number) {
  const changes = [{ old: index + 1, new: -1 }];

  for (let i = 0; i < tempDrawingDescription.value.list.length; i++) {
    if (i > index) {
      changes.push({ old: i + 1, new: i });
    }
  }

  tempDrawingDescription.value.list.splice(index, 1);

  setupDescription(changes);
}

// 기본 영역 드래그 시작(html 기본 drag 이벤트에 할당, 배경색 컨트롤)
const onDragBasicCard = (e: MouseEvent) => {
  basicHoverIndices.value.length = 0;
  isBasicCardDrag.value = true;
  let target = e.target as HTMLElement;
  target.style.background = rgbToRgba("#5c6bc0", ".1");
};

// 기본 영역 드래그 끝(html 기본 drag 이벤트에 할당, 배경색 컨트롤)
const onDragEndBasicCard = (e: MouseEvent) => {
  isBasicCardDrag.value = false;
  let target = e.target as HTMLElement;
  target.style.background = "";

  // console.log("기본영역 카드 드래그 완료");
  // // 드래그로 위치 바뀌었을 때 설정값 업데이트
  workspaceStore.setSettingOption(
    "SETTING/DRAFT/APPLICATION_SPLIT_BASIC_LAYOUT"
  );
  workspaceStore.setSettingValue(JSON.stringify(workspaceStore.basicCardData));
  workspaceStore.requestUpdateSetting = true;
};

// 전체 접기/펴기
function foldAll(gubun: boolean) {
  for (let i = 0; i < workspaceStore.basicCardData.length; i++)
    workspaceStore.basicCardData[i].fold = !gubun;

  // 접힘 상태 변경되었을 때 설정 업데이트
  workspaceStore.setSettingOption(
    "SETTING/DRAFT/APPLICATION_SPLIT_BASIC_LAYOUT"
  );
  workspaceStore.setSettingValue(JSON.stringify(workspaceStore.basicCardData));
  workspaceStore.requestUpdateSetting = true;
}

// 하나 접기/펴기
function fold(element: any) {
  element.fold = !element.fold;

  // 접힘 상태 변경되었을 때 설정 업데이트
  workspaceStore.setSettingOption(
    "SETTING/DRAFT/APPLICATION_SPLIT_BASIC_LAYOUT"
  );
  workspaceStore.setSettingValue(JSON.stringify(workspaceStore.basicCardData));
  workspaceStore.requestUpdateSetting = true;
}

// 각 항목 데이터 길이 체크 -> 각 항목에서 "작성하기" 표시할지 말지 판단
function checkDataLength(element: any) {
  if (element.id === "invention_title") return true;
  if (element.id === "cross_reference")
    if (
      Util.removePTag(workspaceStore.caseData.cross_reference.data).trim()
        .length > 0
    )
      return true;
    else return false;

  if (element.id === "technical_field")
    if (
      Util.removePTag(workspaceStore.caseData.technical_field.data).trim()
        .length > 0
    )
      return true;
    else return false;
  if (element.id === "background")
    if (
      Util.removePTag(workspaceStore.caseData.background.data).trim().length > 0
    )
      return true;
    else return false;
  if (element.id === "prior_art")
    if (
      Util.removePTag(workspaceStore.caseData.prior_art.data).trim().length > 0
    )
      return true;
    else return false;
  if (element.id === "purpose")
    if (Util.removePTag(workspaceStore.caseData.purpose.data).trim().length > 0)
      return true;
    else return false;
  if (element.id === "advantages")
    if (
      Util.removePTag(workspaceStore.caseData.advantages.data).trim().length > 0
    )
      return true;
    else return false;
  if (element.id === "drawings_description")
    if (
      Util.removePTag(workspaceStore.caseData.drawing_description.data).trim()
        .length > 0
    )
      return true;
    else return false;
  if (element.id === "summary")
    if (Util.removePTag(workspaceStore.caseData.summary.data).trim().length > 0)
      return true;
    else return false;
  if (element.id === "industrial_applicability")
    if (
      Util.removePTag(
        workspaceStore.caseData.industrial_applicability.data
      ).trim().length > 0
    )
      return true;
    else return false;
  if (element.id === "sequencelist")
    if (
      Util.removePTag(workspaceStore.caseData.sequencelist.data).trim().length >
      0
    )
      return true;
    else return false;
}

// 통합 입력 방식으로 전환 버튼 클릭
function changeDraftMode() {
  modalStore.infoModal.hide();
  modalStore.infoModal.info = true;
  modalStore.infoModal.alert = false;
  modalStore.infoModal.title = Util.getI18NTxt(
    stores,
    "I18N/WORKSPACE/BASIC/DRAWING_CHANGE_DRAFT_MODE_MODAL_HEADER"
  );
  modalStore.infoModal.desc = Util.getI18NTxt(
    stores,
    "I18N/WORKSPACE/BASIC/DRAWING_CHANGE_DRAFT_MODE_MODAL_CONTENT"
  );
  modalStore.infoModal.buttonType = "NY";
  modalStore.infoModal.noButtonText = Util.getI18NTxt(stores, "I18N/BUTTON/NO");
  modalStore.infoModal.noButtonFunc = () => {
    modalStore.infoModal.hide();
  };
  modalStore.infoModal.yesButtonText = Util.getI18NTxt(
    stores,
    "I18N/BUTTON/YES"
  );
  modalStore.infoModal.yesButtonFunc = () => {
    let descTxt = "";
    let drawingTxt = "도 ";
    let josaTxt = "은";
    if (Util.isJPO(stores)) {
      drawingTxt = "図";
      josaTxt = "は";
    } else if (Util.isUSPTO(stores)) {
      drawingTxt = "Fig. ";
      josaTxt = " is ";
    }

    for (let j = 0; j < tempDrawingDescription.value.list.length; j++) {
      if (Util.isKIPO(stores))
        josaTxt = Util.setJosa(j + 1 + "", josaTxt) + " ";

      const tempDescription = tinymce
        .get("drawing-description" + (j + 1))
        .getContent();

      tempDrawingDescription.value.list[j].description = tempDescription;

      descTxt =
        descTxt +
        "<p>" +
        drawingTxt +
        (j + 1) +
        josaTxt +
        Util.removePTag(tempDescription) +
        "</p>";

      josaTxt = josaTxt.trim();
    }
    //모드 값 변환
    tempDrawingDescription.value.draftType = "merged";

    basicItem.value.desc = descTxt;
    basicItem.value.height = "20rem";
    modalStore.infoModal.hide();
  };
  modalStore.infoModal.duration = undefined;
  modalStore.infoModal.closeBtn = false;
  // 모달 열기
  modalStore.infoModal.show();
}

// 도면의 간단한 설명 에디터 셋업
function drawingDescriptionEditorSetup(editor: EditorType) {
  // 도면의 간단한 설명 에디터 blur 이벤트 주기 위함
  editor.on("focusout", setDrawingDescription);

  // 도면의 간단한 설명에서 엔터
  editor.on("keydown", function (e: KeyboardEvent) {
    if (
      (e.key == "Enter" && (e.code == "Enter" || e.code == "NumpadEnter")) ||
      e.key === "Tab"
    ) {
      e.preventDefault();
      e.stopPropagation();
      const currentEditorNumber = parseInt(
        tinymce.activeEditor.id.replace("drawing-description", "")
      );
      const nextEditorID = "drawing-description" + (currentEditorNumber + 1);
      if (tinymce.get(nextEditorID) !== null) {
        tinymce.get(nextEditorID).focus();
        tinymce
          .get(nextEditorID)
          .selection.select(tinymce.get(nextEditorID).getBody(), true);
        tinymce.get(nextEditorID).selection.collapse(false);
      }
    }
  });
}

// 도면별 설명 입력 에디터에서 blur될 때마다, 전체 설명 리스트 데이터 셋업해줌
// (이거 안해주면 에디터에 있는 데이터들이 날라감)
function setDrawingDescription() {
  for (let i = 0; i < tempDrawingDescription.value.list.length; i++) {
    tempDrawingDescription.value.list[i].description = tinymce
      .get("drawing-description" + (i + 1))
      .getContent();
  }
}

// 도면의 간단한 설명 리스트 화면에서 도면 드래그 이동
function drawingMoved(e: any) {
  // console.log("drawingDragEnd, number", e);
  const oldIndex = e.moved.oldIndex;
  const newIndex = e.moved.newIndex;
  let direction = "up";
  const changes = [{ old: oldIndex + 1, new: newIndex + 1 }];

  if (newIndex > oldIndex) direction = "down";

  for (let i = 0; i < tempDrawingDescription.value.list.length; i++) {
    // 아래에서 위로 drag한 경우
    if (direction === "up") {
      if (i < newIndex) continue;
      else if (i >= newIndex && i < oldIndex) {
        changes.push({ old: i + 1, new: i + 2 });
      } else if (i > oldIndex) continue;
    }
    // 위에서 아래로 drag한 경우
    else {
      if (i < oldIndex) continue;
      else if (i >= oldIndex && i < newIndex) {
        changes.push({ old: i + 2, new: i + 1 });
      } else if (i > newIndex) continue;
    }
  }

  // console.log(changes);

  setupDescription(changes);
}

// 도면의 간단한 설명 리스트 화면에서 도면 드래그 이동되었을 때, 설명부분 텍스트 정리
function setupDescription(changes: any) {
  // 도X, 도 X 찾기 위한 정규식
  let drawingRegExp = /도[0-9]+|도\s[0-9]+/g;
  let drawingTxt = "도";
  // TODO: regNum 정규식 맞는지 체크 필요
  let regNum = /[0-9]/g;
  let spaceTxt = " ";
  if (Util.isJPO(stores)) {
    drawingRegExp = /図[０１２３４５６７８９]+|図\s[０１２３４５６７８９]+/g;
    drawingTxt = "図";
    regNum = /[０１２３４５６７８９]/g;
    spaceTxt = "　";
  } else if (Util.isUSPTO(stores)) {
    drawingRegExp = /Fig\.[0-9]+|Fig\.\s[0-9]+/g;
    drawingTxt = "Fig.";
  }

  const tempDescriptionList = JSON.parse(
    JSON.stringify(tempDrawingDescription.value.list)
  );

  // console.log(tempDrawingDescription.value.list);
  // console.log(tempDescriptionList);

  for (let i = 0; i < tempDescriptionList.length; i++) {
    tinymce
      .get("drawing-description" + (i + 1))
      .setContent(tempDescriptionList[i].description);
  }

  // 각 도면 설명마다 바뀐 도면 번호 적용해 줌
  for (let i = 0; i < tempDescriptionList.length; i++) {
    let description = tempDescriptionList[i].description;
    // console.log(description);
    // let description = tinymce.get("drawing-description" + (i + 1)).getContent();
    for (let j = 0; j < changes.length; j++) {
      // console.log(description.match(drawingRegExp));
      let oldTxt1 = "";
      let oldTxt2 = "";
      let newTxt = "";
      // 일본어 케이스인 경우에는 전자로 전환해서 처리
      if (Util.isJPO(stores)) {
        oldTxt1 = drawingTxt + Util.toJPFullWidth(changes[j].old);
        oldTxt2 = drawingTxt + spaceTxt + Util.toJPFullWidth(changes[j].old);
        if (changes[j].new >= 0) newTxt = Util.toJPFullWidth(changes[j].new);
        else newTxt = "「削除」";
      } else {
        oldTxt1 = drawingTxt + changes[j].old;
        oldTxt2 = drawingTxt + spaceTxt + changes[j].old;
        if (changes[j].new >= 0) newTxt = changes[j].new;
        else newTxt = "[deleted number]";
      }

      // console.log(oldTxt1, oldTxt2, newTxt);

      if (
        description.match(drawingRegExp)?.includes(oldTxt1) ||
        description.match(drawingRegExp)?.includes(oldTxt2)
      ) {
        // console.log(description, oldTxt1, oldTxt2, newTxt);
        const tempArray1 = description.split(oldTxt1);

        if (tempArray1.length > 1) {
          let tempDescription = "";
          for (let k = 0; k < tempArray1.length - 1; k++) {
            if (regNum.test(tempArray1[k + 1][0]))
              tempDescription = tempDescription + oldTxt1 + tempArray1[k + 1];
            else
              tempDescription =
                tempDescription +
                tempArray1[k] +
                "XXIPEDITXX" +
                newTxt +
                tempArray1[k + 1];
          }
          description = tempDescription;
        }
        // console.log(description);

        const tempArray2 = description.split(oldTxt2);
        if (tempArray2.length > 1) {
          let tempDescription = "";
          for (let k = 0; k < tempArray2.length - 1; k++) {
            if (regNum.test(tempArray2[k + 1][0]))
              tempDescription = tempDescription + oldTxt2 + tempArray2[k + 1];
            else
              tempDescription =
                tempDescription +
                tempArray2[k] +
                "XXIPEDITXX" +
                spaceTxt +
                newTxt +
                tempArray2[k + 1];
          }

          description = tempDescription;
        }
        // console.log(description);
      }
    }
    description = description.replace(/XXIPEDITXX/g, drawingTxt);

    // console.log(description);

    // 한국 케이스인 경우 조사 변경해주기
    if (Util.isKIPO(stores)) {
      const tempArray = description.split(" ");
      for (let j = 0; j < tempArray.length; j++) {
        const reg2 = /[0-9]+[가-힣]+|\s[0-9]+[가-힣]+/g;
        const reg3 = /[0-9]/g;
        let lastIndex = 0;
        if (reg2.test(tempArray[j])) {
          for (let k = tempArray[j].length - 1; k >= 0; k--) {
            if (reg3.test(tempArray[j][k])) {
              lastIndex = k;
              break;
            }
          }
          const word = tempArray[j].substring(0, lastIndex + 1);
          const currentJosa = tempArray[j].substring(
            lastIndex + 1,
            tempArray[j].length
          );
          const rightJosa = Util.setJosa(word, currentJosa);
          // console.log(word, currentJosa, rightJosa);
          tempArray[j] = word + rightJosa;
        }
      }

      // console.log(tempArray);

      // 조사 변경된거 반영해서 합쳐주기
      description = "";
      for (let j = 0; j < tempArray.length; j++) {
        description = description + " " + tempArray[j];
      }
    }

    // console.log(description);

    tempDescriptionList[i].description = description;
    tinymce.get("drawing-description" + (i + 1)).setContent(description);
  }
  tempDrawingDescription.value.list = tempDescriptionList;
}

// 저장될 텍스트 설정 및 에디터 셋팅
function setupSaveText() {
  basicItem.value.desc = tinymce.get("basic-editor").getContent();

  // 마지막에 들어간 빈줄 제거
  let tempText = basicItem.value.desc.trim();
  while (
    tempText.length >= 13 &&
    tempText.substring(tempText.length - 13, tempText.length) ===
      "<p>&nbsp;</p>"
  ) {
    tempText = tempText.substring(0, tempText.length - 13).trim();
  }
  tinymce.get("basic-editor").setContent(tempText);

  return tempText;
}

// 데이터 확인 클릭 -> 저장함
async function saveBasicData() {
  let saveResult: boolean | undefined = false;

  // 발명의 명칭 저장
  if (basicItem.value.id === "invention_title") {
    if (Util.isInlineEditorEmpty(tinymce.get("invention-title"))) {
      Util.openInfoModal(
        stores,
        Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/REQUEST_DATA_ALERT"),
        true
      );
      document.getElementById("invention-title")?.focus();
      return;
    }

    for (let i = 0; i < workspaceStore.basicCardData.length; i++) {
      if (workspaceStore.basicCardData[i].id === "invention_title") {
        inventionTitle.value.data = tinymce
          .get("invention-title")
          .getContent()
          .replace(/((\&nbsp\;)|\s)+\<\/p\>/gi, "</p>");
        inventionTitle.value.data_sub = tinymce
          .get("invention-title2")
          ?.getContent()
          .replace(/((\&nbsp\;)|\s)+\<\/p\>/gi, "</p>");

        workspaceStore.caseData.invention_title.data =
          inventionTitle.value.data;
        workspaceStore.caseData.invention_title.data_sub =
          inventionTitle.value.data_sub;

        // tldexie 저장
        const updateTitleResult = await tldexie.updateLayeredData(
          workspaceStore.active_save_slot,
          "invention_title",
          JSON.stringify(workspaceStore.caseData.invention_title)
        );

        if (updateTitleResult) {
          // 구성요소에서 발명의 명칭에 대응되는 것 수정
          for (
            let j = 0;
            j < workspaceStore.caseData.elements.list.length;
            j++
          ) {
            if (workspaceStore.caseData.elements.list[j].inputOrder === 0) {
              workspaceStore.setTargetElement(
                workspaceStore.caseData.elements.list[j]
              );
              workspaceStore.caseData.elements.list[j].name =
                workspaceStore.caseData.invention_title.data;
              break;
            }
          }
          // 구성요소 tldexie 저장
          saveResult = await tldexie.updateLayeredData(
            workspaceStore.active_save_slot,
            "elements",
            JSON.stringify(workspaceStore.caseData.elements)
          );

          // 구성요소 자동완성된 것 바꿔주기(workspaceStore.targetElement는 위에서 설정함)
          workspaceStore.setIsElementUpdated(true);
        }

        break;
      }
    }
  }

  // 상호참조 저장
  if (basicItem.value.id === "cross_reference") {
    for (let i = 0; i < workspaceStore.basicCardData.length; i++) {
      if (workspaceStore.basicCardData[i].id === "cross_reference") {
        workspaceStore.caseData.cross_reference.data = setupSaveText();

        // tldexie 저장
        saveResult = await tldexie.updateLayeredData(
          workspaceStore.active_save_slot,
          "cross_reference",
          JSON.stringify(workspaceStore.caseData.cross_reference)
        );

        break;
      }
    }
  }

  // 기술분야 저장
  if (basicItem.value.id === "technical_field") {
    for (let i = 0; i < workspaceStore.basicCardData.length; i++) {
      if (workspaceStore.basicCardData[i].id === "technical_field") {
        workspaceStore.caseData.technical_field.data = setupSaveText();

        // tldexie 저장
        saveResult = await tldexie.updateLayeredData(
          workspaceStore.active_save_slot,
          "technical_field",
          JSON.stringify(workspaceStore.caseData.technical_field)
        );

        break;
      }
    }
  }

  // 배경기술 저장
  if (basicItem.value.id === "background") {
    for (let i = 0; i < workspaceStore.basicCardData.length; i++) {
      if (workspaceStore.basicCardData[i].id === "background") {
        workspaceStore.caseData.background.data = setupSaveText();

        // tldexie 저장
        saveResult = await tldexie.updateLayeredData(
          workspaceStore.active_save_slot,
          "background",
          JSON.stringify(workspaceStore.caseData.background)
        );

        break;
      }
    }
  }

  // 선행기술 저장
  if (basicItem.value.id === "prior_art") {
    for (let i = 0; i < workspaceStore.basicCardData.length; i++) {
      if (workspaceStore.basicCardData[i].id === "prior_art") {
        workspaceStore.caseData.prior_art.data = setupSaveText();

        // tldexie 저장
        saveResult = await tldexie.updateLayeredData(
          workspaceStore.active_save_slot,
          "prior_art",
          JSON.stringify(workspaceStore.caseData.prior_art)
        );

        break;
      }
    }
  }

  // 해결하고자 하는 과제 저장
  if (basicItem.value.id === "purpose") {
    for (let i = 0; i < workspaceStore.basicCardData.length; i++) {
      if (workspaceStore.basicCardData[i].id === "purpose") {
        workspaceStore.caseData.purpose.data = setupSaveText();

        // tldexie 저장
        saveResult = await tldexie.updateLayeredData(
          workspaceStore.active_save_slot,
          "purpose",
          JSON.stringify(workspaceStore.caseData.purpose)
        );

        break;
      }
    }
  }

  // 효과 저장
  if (basicItem.value.id === "advantages") {
    for (let i = 0; i < workspaceStore.basicCardData.length; i++) {
      if (workspaceStore.basicCardData[i].id === "advantages") {
        workspaceStore.caseData.advantages.data = setupSaveText();

        // tldexie 저장
        saveResult = await tldexie.updateLayeredData(
          workspaceStore.active_save_slot,
          "advantages",
          JSON.stringify(workspaceStore.caseData.advantages)
        );

        break;
      }
    }
  }

  // summary 저장
  if (basicItem.value.id === "summary") {
    for (let i = 0; i < workspaceStore.basicCardData.length; i++) {
      if (workspaceStore.basicCardData[i].id === "summary") {
        workspaceStore.caseData.summary.data = setupSaveText();

        // tldexie 저장
        saveResult = await tldexie.updateLayeredData(
          workspaceStore.active_save_slot,
          "summary",
          JSON.stringify(workspaceStore.caseData.summary)
        );

        break;
      }
    }
  }

  // 산업상 이용 가능성 저장
  if (basicItem.value.id === "industrial_applicability") {
    for (let i = 0; i < workspaceStore.basicCardData.length; i++) {
      if (workspaceStore.basicCardData[i].id === "industrial_applicability") {
        workspaceStore.caseData.industrial_applicability.data = setupSaveText();

        // tldexie 저장
        saveResult = await tldexie.updateLayeredData(
          workspaceStore.active_save_slot,
          "industrial_applicability",
          JSON.stringify(workspaceStore.caseData.industrial_applicability)
        );

        break;
      }
    }
  }

  // 서열목록 프리텍스트 저장
  if (basicItem.value.id === "sequencelist") {
    for (let i = 0; i < workspaceStore.basicCardData.length; i++) {
      if (workspaceStore.basicCardData[i].id === "sequencelist") {
        workspaceStore.caseData.sequencelist.data = setupSaveText();

        // tldexie 저장
        saveResult = await tldexie.updateLayeredData(
          workspaceStore.active_save_slot,
          "sequencelist",
          JSON.stringify(workspaceStore.caseData.sequencelist)
        );

        break;
      }
    }
  }

  // 도면의 간단한 설명 저장
  if (basicItem.value.id === "drawings_description") {
    for (let i = 0; i < workspaceStore.basicCardData.length; i++) {
      if (workspaceStore.basicCardData[i].id === "drawings_description") {
        let descTxt = "";
        let drawingTxt = "도 ";
        let josaTxt = "은";
        if (Util.isJPO(stores)) {
          drawingTxt = "図";
          josaTxt = "は";
        } else if (Util.isUSPTO(stores)) {
          drawingTxt = "Fig. ";
          josaTxt = " is ";
        }
        // 작성 방식이 리스트인 경우
        if (tempDrawingDescription.value.draftType === "list") {
          for (let j = 0; j < tempDrawingDescription.value.list.length; j++) {
            if (Util.isKIPO(stores))
              josaTxt = Util.setJosa(j + 1 + "", josaTxt) + " ";

            const tempDescription = tinymce
              .get("drawing-description" + (j + 1))
              .getContent();

            tempDrawingDescription.value.list[j].description = tempDescription;

            descTxt =
              descTxt +
              "<p>" +
              drawingTxt +
              (j + 1) +
              josaTxt +
              Util.removePTag(tempDescription) +
              "</p>";

            josaTxt = josaTxt.trim();
          }
        }
        // 작성 방식이 통합인 경우
        else {
          // 화면용 데이터 셋팅
          descTxt = setupSaveText();
        }

        // 스토어 셋팅
        workspaceStore.caseData.drawing_description =
          tempDrawingDescription.value;
        workspaceStore.caseData.drawing_description.data = descTxt;

        // tldexie 저장
        saveResult = await tldexie.updateLayeredData(
          workspaceStore.active_save_slot,
          "drawing_description",
          JSON.stringify(workspaceStore.caseData.drawing_description)
        );

        break;
      }
    }
  }

  if (saveResult)
    workspaceStore.showSnackbar(
      Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/SAVE_SUCCESSED").replace(
        "$DATA$",
        setModalTitle(basicItem.value.id)
      ),
      "info"
    );
  else
    workspaceStore.showSnackbar(
      Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/SAVE_FAILED").replace(
        "$DATA$",
        setModalTitle(basicItem.value.id)
      ),
      "error"
    );

  tinymce
    .get("basic-editor")
    ?.selection.select(tinymce.get("basic-editor")?.getBody(), true);
  tinymce.get("basic-editor")?.selection.collapse(false);
}

const asyncSaveBasicData = asyncDebounce(saveBasicData);

const asyncSaveBasicDataSpinner = () =>
  modalSpinner.value?.setSpinner(asyncSaveBasicData, "translucent")();

function dragStart(e: DragEvent) {
  // props에 watch 붙어 있는게 정상 작동 안해서 강제로 드래그 시작 시 false됨
  modelValue.value = false;
  workspaceStore.areaDragStart(e);
}

function dragEnd(e: DragEvent) {
  workspaceStore.areaDragEnd(e);
  modelValue.value = true;
  // console.log(modelValue.value);
}

// props가 바뀔 때(부모에서 값이 바뀔 때)
watch(props, () => {
  modelValue.value = props.modelValue;
});

// modelValue가 바뀔 때(컴포넌트 내부에서 값이 바뀔 때)
watch(modelValue, () => {
  emit("update:modelValue", modelValue.value);
});

async function initialSetupBasicData() {
  const basicCardShow = {
    invention_title: true,
    cross_reference: true,
    technical_field: true,
    background: true,
    prior_art: true,
    purpose: true,
    advantages: true,
    drawings_description: true,
    summary: true,
    industrial_applicability: true,
    sequencelist: true,
  };

  // KIPO, 명세서 작성인 경우
  if (Util.isKIPO(stores) && Util.isApplication(stores)) {
    basicCardShow.cross_reference = false;
    basicCardShow.summary = false;
    basicCardShow.industrial_applicability = false;
    basicCardShow.sequencelist = false;
  }
  // KIPO, PCT인 경우
  else if (Util.isKIPO(stores) && Util.isPCT(stores)) {
    basicCardShow.cross_reference = false;
    basicCardShow.prior_art = false;
    basicCardShow.summary = false;
  }

  // JPO, 명세서 작성인 경우
  if (Util.isJPO(stores) && Util.isApplication(stores)) {
    basicCardShow.cross_reference = false;
    basicCardShow.summary = false;
    basicCardShow.industrial_applicability = false;
    basicCardShow.sequencelist = false;
  }
  // JPO, PCT인 경우
  else if (Util.isJPO(stores) && Util.isPCT(stores)) {
    basicCardShow.cross_reference = false;
    // basicCardShow.prior_art = false;
    basicCardShow.summary = false;
  }

  // USPTO, 명세서 작성인 경우
  if (Util.isUSPTO(stores) && Util.isApplication(stores)) {
    basicCardShow.prior_art = false;
    basicCardShow.purpose = false;
    basicCardShow.advantages = false;
    basicCardShow.industrial_applicability = false;
    basicCardShow.sequencelist = false;
  }
  // USPTO, PCT인 경우
  else if (Util.isUSPTO(stores) && Util.isPCT(stores)) {
    basicCardShow.cross_reference = false;
    basicCardShow.prior_art = false;
    basicCardShow.purpose = false;
    basicCardShow.advantages = false;
  }

  workspaceStore.controlBasicCardShow(
    "invention_title",
    basicCardShow.invention_title
  );
  workspaceStore.controlBasicCardShow(
    "cross_reference",
    basicCardShow.cross_reference
  );
  workspaceStore.controlBasicCardShow(
    "technical_field",
    basicCardShow.technical_field
  );
  workspaceStore.controlBasicCardShow("background", basicCardShow.background);
  workspaceStore.controlBasicCardShow("prior_art", basicCardShow.prior_art);
  workspaceStore.controlBasicCardShow("purpose", basicCardShow.purpose);
  workspaceStore.controlBasicCardShow("advantages", basicCardShow.advantages);
  workspaceStore.controlBasicCardShow(
    "drawings_description",
    basicCardShow.drawings_description
  );
  workspaceStore.controlBasicCardShow("summary", basicCardShow.summary);
  workspaceStore.controlBasicCardShow(
    "industrial_applicability",
    basicCardShow.industrial_applicability
  );
  workspaceStore.controlBasicCardShow(
    "sequencelist",
    basicCardShow.sequencelist
  );

  console.log("basics component initialized");
}

watch(workspaceStore, () => {
  if (workspaceStore.initializeBasicArea) {
    // 데이터 초기화
    initialSetupBasicData();

    workspaceStore.initializeBasicArea = false;
  }
});

// 발명의 명칭(기본) 및 도면 개별 설명 핸들링
const handleDataEnter = (editor: any) => {
  editor.on("keydown", function (e: KeyboardEvent) {
    if (
      (e.key == "Enter" && (e.code == "Enter" || e.code == "NumpadEnter")) ||
      (e.key === "s" && (e.ctrlKey || e.metaKey))
    ) {
      e.preventDefault();
      e.stopPropagation();
      if (Util.isKIPO(stores)) {
        tinymce.get("invention-title2").focus();
        tinymce
          .get("invention-title2")
          .selection.select(tinymce.get("invention-title2").getBody(), true);
        tinymce.get("invention-title2").selection.collapse(false);
      } else {
        saveBasicData();
      }
    }
  });
};

// 발명의 명칭(추가) 핸들링 - KIPO인 경우
const handleDataSubEnter = (editor: any) => {
  editor.on("keydown", function (e: KeyboardEvent) {
    if (
      (e.key == "Enter" && (e.code == "Enter" || e.code == "NumpadEnter")) ||
      (e.key === "s" && (e.ctrlKey || e.metaKey))
    ) {
      e.preventDefault();
      e.stopPropagation();
      saveBasicData();
    }
  });
};

const editorSetup = (editor: any) => {
  editor.on("keydown", function (e: KeyboardEvent) {
    // console.log(e);
    if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      e.stopPropagation();
      saveBasicData();
    }
  });
};

const titleEditorInitCallback = () => {
  tinymce.get("invention-title").focus();
  tinymce
    .get("invention-title")
    .selection.select(tinymce.get("invention-title").getBody(), true);
  tinymce.get("invention-title").selection.collapse(false);
};

const editorInitCallback = () => {
  tinymce.activeEditor.focus();
  tinymce.activeEditor.selection.select(tinymce.activeEditor.getBody(), true);
  tinymce.activeEditor.selection.collapse(false);

  // console.log("!!!!!!!!!!!!!!!!!", tinymce.activeEditor.id);
};

const modalSpinner = ref<IIComponentSpinner>();

/**도면의 간단한 설명 모달 도면 업로드 구현부 */
const drawingFiles = ref<DrawingData[]>([]);
const curDrawingIdx = ref(0);

// 도면 드래그 버튼 스타일
const drawingIdxBgColor = computed(() => (index: number) => {
  if (curDrawingIdx.value === index) {
    if (themeStore.isDarkmode) return Util.getColor(stores, "PRIMARY_DARK");
    else return themeStore.workspacePrimary;
  } else {
    if (themeStore.isDarkmode) return themeStore.darkmodeBackgroundColor;
    return "white";
  }
});

const drawingIdxBtnColor = computed(() => (index: number) => {
  if (curDrawingIdx.value === index) {
    if (themeStore.isDarkmode) return Util.getColor(stores, "BUTTON_TEXT");
    else return Util.getColor(stores, "BUTTON_TEXT");
  } else {
    if (themeStore.isDarkmode) return "#BDBDBD";
    return "#616161";
  }
});

const drawingIdxBorderColor = computed(() => (index: number) => {
  if (curDrawingIdx.value === index) return "1px solid transparent";
  else if (themeStore.isDarkmode) return stores.ts.darkmodeBorder;
  else return "1px solid #DFDFDF";
});

function onClickDrawingIdxBtn(idx: number) {
  // 현재 도면 인덱스를 클릭한 아이템의 인덱스로 변경
  curDrawingIdx.value = idx;
}

// pdf File 객체
const pdfFile = ref<File>();

// PDFObject 조건 확인
const isSrcImg = ref(true);

async function setDrawing() {
  // 케이스 데이터에 도면이 있으면 pdf 혹은 이미지를 로딩
  const drawings = workspaceStore.caseData.drawings;
  const drawing: DrawingData = drawings[0];

  if (drawings.length) {
    if (drawing.type.includes("pdf")) {
      // 이전 업로드 때 pdf라면 파일이 1개일 수 밖에 없으므로 첫 번째 파일 가져옴
      pdfFile.value = await Util.urlToFile(
        drawing.data as string,
        drawing.name,
        drawing.type
      );
      setPdfobject();
      return;
    }
  }

  isSrcImg.value = true;
}

// Pdfobject 세팅
function setPdfobject() {
  if (pdfFile.value) {
    // 상태 변경
    isSrcImg.value = false;

    // 파일 URL 생성
    const url = URL.createObjectURL(pdfFile.value);

    let pdfOptions: PDFObject.Options = {
      // 뷰어를 강제로 pdfjs로 설정할 것인가
      forcePDFJS: true,
      // 뷰어 URL
      PDFJS_URL: "/pdfjs/build/minified/web/viewer.html",
      // ADOBE에서 지원하는 PDF 오픈 파라미터
      pdfOpenParams: {
        // (accepted values: none, thumbs, bookmarks, attachments)
        pagemode: "none",
      },
    };

    // 임베딩
    PDFObject.embed(url, "#drawings-modal-pdf", pdfOptions);
  }
}

const vInitBasicEditModal: Directive = {
  mounted() {
    if (basicItem.value.id === "drawings_description") {
      // 스토어 변수 basics로 복사
      drawingFiles.value = [...workspaceStore.caseData.drawings];
      curDrawingIdx.value = workspaceStore.curDrawingIdx;
      checkPDF();
      setDrawing();
    }
  },
  beforeUnmount() {
    // 모달이 종료될 때 drawings로 변수 복사
    workspaceStore.caseData.drawings = [...drawingFiles.value];
    workspaceStore.curDrawingIdx = curDrawingIdx.value;
  },
};

function checkPDF() {
  const drawings = workspaceStore.caseData.drawings;
  const drawing: DrawingData = drawings[0];

  if (drawings.length && drawing.type.includes("pdf")) isSrcImg.value = false;
  else isSrcImg.value = true;
}

onMounted(async () => {
  console.log("basics mounted");
  isMounted.value = true;
});

onBeforeMount(() => {
  // 구성요소 번호 보기 셋팅
  if (Util.getSettingValue(stores, "SETTING/DRAFT/BASIC_SHOW_NUMBER") === "N")
    showNumber.value = false;
});

// 넘버 보기 상태 변경하면 설정값 업데이트
watch(showNumber, () => {
  if (isMounted.value) {
    // 레이아웃 설정값 업데이트
    workspaceStore.setSettingOption("SETTING/DRAFT/BASIC_SHOW_NUMBER");
    if (showNumber.value) workspaceStore.setSettingValue("Y");
    else workspaceStore.setSettingValue("N");
    workspaceStore.requestUpdateSetting = true;
  }
});
</script>

<style lang="scss" scoped>
@import "@/styles/draft/text";
.basics {
  position: relative;
  width: 100%;
  background-color: white;
  border: 0.0625rem solid #dfdfdf;
  .basics-header {
    height: 1.5rem;
    white-space: nowrap;
    .basics-header-options {
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

  .basics-body {
    height: 100%;
    overflow: overlay;
  }
  .basic-card {
    .basic-card-write-txt {
      width: 100%;
      cursor: pointer;
      text-align: center;
    }
  }
}
.drawings-desc-modal-content {
  display: flex;
  align-content: center;
  justify-content: center;
  .basics-drawings-content {
    height: 100%;
    .drawing-no-files {
      width: 100%;
      height: 100%;
    }
    .drawings-files {
      width: 100%;
      height: 100%;
    }
    .drawings-image-name {
      width: 100%;
      position: relative;
      text-align: center;
    }
    .drawings-image {
      width: 95%;
      max-height: 25rem;
      background-color: #eeeeee;
      box-shadow: (0rem 0.125rem 0.3125rem rgba(0, 0, 0, 0.15));
    }
    .drawings-pdf {
      width: 100%;
      height: 100%;
      background-color: #eeeeee;
      box-shadow: 0 0.125rem 0.3125rem 0.0625rem rgba(0, 0, 0, 0.2);
      overflow: hidden;
    }
    .drawings-idx-btn {
      width: 2rem;
      height: 2rem;
      border: 0.0625rem solid #e0e0e0;
      border-radius: 0.25rem;
      font-size: 0.875rem;
      font-weight: 600;
      text-align: center;
      line-height: 2rem;
      cursor: pointer;
      &:hover {
        opacity: 0.6;
      }
    }
  }
}
input:focus {
  outline: none;
}
.drawing-add-btn {
  cursor: pointer;
  &:hover {
    opacity: 0.6;
  }
}
</style>
