<template>
  <div
    id="description"
    ref="description"
    class="description d-flex flex-column"
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
    <div class="description-header d-flex justify-space-between ma-3">
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
          {{ getDescriptionAreaTitle() }}
        </div>
        <IconBtn
          v-if="!workspaceStore.claimWizardModal.isOpen && !isReadonlyWindow"
          class="mt-1 ml-2"
          :icon="mdiMenuDown"
          color="#9e9e9e"
          @mouseover="isHoverTitleDownIcon = true"
          @mouseleave="isHoverTitleDownIcon = false"
          ><div
            v-if="isHoverTitleDownIcon"
            class="description-magition-options"
          >
            <ul>
              <!-- 구성요소 설명 에디터 -->
              <li
                v-if="Util.isApplication(stores) || Util.isPCT(stores)"
                class="text-400-14-black justify-start"
                @mousedown="openElDescInputMagicianModal"
              >
                {{
                  Util.getI18NTxt(
                    stores,
                    "I18N/WORKSPACE/DETAILED_DESCRIPTION/DROPDOWN_ELEMENT_INPUT_WIZARD"
                  )
                }}
              </li>
              <!-- 구성요소 추출 -->
              <li
                v-if="Util.isApplication(stores) || Util.isPCT(stores)"
                class="text-400-14-black justify-start"
                @mousedown="openElementExtractCopyMagician"
              >
                {{
                  Util.getI18NTxt(
                    stores,
                    "I18N/WORKSPACE/DETAILED_DESCRIPTION/DROPDOWN_ELEMENT_EXTRACT_WIZARD"
                  )
                }}
              </li>
              <!-- 관용어구 삽입 -->
              <li
                class="text-400-14-black justify-start"
                @mousedown="insertIdiom"
              >
                {{
                  Util.getI18NTxt(
                    stores,
                    "I18N/WORKSPACE/DETAILED_DESCRIPTION/DROPDOWN_IDIOM_INSERT_WIZARD"
                  )
                }}
              </li>
            </ul>
          </div></IconBtn
        >
      </div>

      <div class="d-flex">
        <div class="d-flex">
          <IconBtn
            v-if="!isReadonlyWindow"
            :icon="mdiOpenInNew"
            color="#9E9E9E"
            @click="openNewTabBtn"
          />
          <IconBtn :icon="mdiClose" color="#9E9E9E" @click="closeArea" />
        </div>
      </div>
    </div>
    <Divider
      v-if="!descriptionSpinner?.isOpen"
      height="0.0625rem"
      :bdColor="
        stores.ts.isDarkmode
          ? stores.ts.darkmodePalette.border.substring(10)
          : '#DFDFDF'
      "
    />
    <div class="description-content text-400-14-black" style="height: 100%">
      <Editor
        id="detailed-description"
        :init="{
          ...tinymceConfig,
          height: '100%',
          setup: editorSetup,
          callback: editorInitCallback,
        }"
        :style="[
          {
            padding: '0.625rem',
            marginBottom: '0.75rem',
            backgroundColor: stores.ts.darkmodeBackgroundColor,
          },
        ]"
        useAutocomplete
      />
      <!-- <div
        v-if="!editorLoaded"
        class="d-flex justify-center align-center"
        style="
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          background: white;
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
      </div> -->
      <IComponentSpinner ref="descriptionSpinner" />
    </div>

    <!-- 모달 영역 -->
    <teleport to="#modal-area">
      <!-- 구성요소 설명 에디터 -->
      <Modal
        ref="elementDescriptionEditor"
        :title="
          Util.getI18NTxt(
            stores,
            'I18N/WORKSPACE/DETAILED_DESCRIPTION/DROPDOWN_ELEMENT_INPUT_WIZARD'
          )
        "
        buttonType="NY"
        :noTxt="Util.getI18NTxt(stores, 'I18N/BUTTON/CLOSE')"
        :yesTxt="
          Util.getI18NTxt(
            stores,
            'I18N/WORKSPACE/DETAILED_DESCRIPTION/ELEMENT_INPUT_WIZARD_INPUT_TEXT_BUTTON'
          )
        "
        :yesFunc="onClickYesBtnInElDescEditor"
        :top="100"
        :left="elDescInputMagitLeft"
        :right="elDescInputMagitRight"
        closeBtn
        opacityBar
        v-init-el-desc-editor
      >
        <div
          class="d-flex mt-5"
          style="
            width: 75rem;
            height: 43rem;

            border-top: ;
          "
          :style="{
            borderTop: stores.ts.isDarkmode
              ? stores.ts.darkmodePalette.border
              : '0.0625rem solid #e0e0e0',
          }"
        >
          <div
            style="width: 25rem; padding-right: 1.5rem"
            :style="{
              borderRight: stores.ts.isDarkmode
                ? stores.ts.darkmodePalette.border
                : '0.0625rem solid #e0e0e0',
            }"
          >
            <div
              class="text-bold-16-black mt-5 mb-2"
              :style="{ color: stores.ts.darkmodeColor }"
            >
              {{
                Util.getI18NTxt(
                  stores,
                  "I18N/WORKSPACE/DETAILED_DESCRIPTION/ELEMENT_INPUT_WIZARD_ELEMENT"
                )
              }}
            </div>
            <div class="text-500-12-gray">
              {{
                Util.getI18NTxt(
                  stores,
                  "I18N/WORKSPACE/DETAILED_DESCRIPTION/ELEMENT_INPUT_WIZARD_ELEMENT_GUIDE"
                )
              }}
            </div>

            <!-- 구성요소 리스트 영역 -->
            <div
              id="element-table"
              class="element-table mt-3"
              :style="{
                border: stores.ts.isDarkmode
                  ? stores.ts.darkmodePalette.border
                  : '0.0625rem solid #e0e0e0',
              }"
            >
              <!-- 테이블 헤더 -->
              <div class="element-table-head d-flex" style="width: 100%">
                <!-- 명칭 영역 -->
                <div
                  class="th d-flex"
                  style="border-right: 0; width: 75%; height: 2.25rem"
                  :style="{
                    backgroundColor: stores.ts.isDarkmode ? '#2d2d2d' : '',
                    border: stores.ts.isDarkmode
                      ? stores.ts.darkmodePalette.border
                      : '0.0625rem solid #e0e0e0',
                  }"
                >
                  <!-- 명칭 컬럼 -->
                  <div class="d-flex" style="width: 75%">
                    <div
                      class="mx-1 text-bold-14-gray"
                      style="line-height: 1.125rem"
                      :style="{
                        color: stores.ts.isDarkmode ? '#bdbdbd' : '#616161',
                      }"
                    >
                      {{
                        Util.getI18NTxt(
                          stores,
                          "I18N/WORKSPACE/ELEMENTS_LIST/NAME"
                        )
                      }}
                    </div>
                    <div class="d-flex flex-column">
                      <SvgBtn
                        width="10"
                        height="10"
                        viewBox="0 0 8 8"
                        :color="sortColors.nameSortAscColor"
                        @click="sortElementList('name', 'ASC')"
                      >
                        <SortAsc />
                      </SvgBtn>

                      <SvgBtn
                        width="10"
                        height="10"
                        viewBox="0 0 8 8"
                        :color="sortColors.nameSortDescColor"
                        @click="sortElementList('name', 'DESC')"
                      >
                        <SortDesc />
                      </SvgBtn>
                    </div>
                  </div>
                  <!-- 시간순 정렬 컬럼  -->
                  <div class="d-flex justify-end" style="width: 25%">
                    <IconBtn
                      :icon="inputOrderBtnIcon"
                      :color="sortColors.inputOrderSortColor"
                      @click="
                        sortElementList(
                          'inputOrder',
                          sortColors.inputOrderSort === 'ASC' ? 'ASC' : 'DESC'
                        )
                      "
                    />
                  </div>
                </div>
                <!-- 번호 영역 -->
                <div
                  class="th d-flex"
                  style="width: calc(25% - 0.1875rem); height: 2.25rem"
                  :style="{
                    backgroundColor: stores.ts.isDarkmode ? '#2d2d2d' : '',
                    border: stores.ts.darkmodeBorder,
                  }"
                >
                  <div
                    class="mr-1"
                    style="line-height: 1.125rem"
                    :style="{ color: stores.ts.isDarkmode ? '#bdbdbd' : '' }"
                  >
                    {{
                      Util.getI18NTxt(
                        stores,
                        "I18N/WORKSPACE/ELEMENTS_LIST/NUMBER"
                      )
                    }}
                  </div>
                  <div class="d-flex flex-column">
                    <SvgBtn
                      width="10"
                      height="10"
                      viewBox="0 0 8 8"
                      :color="sortColors.numberSortAscColor"
                      @click="sortElementList('number', 'ASC')"
                    >
                      <SortAsc />
                    </SvgBtn>

                    <SvgBtn
                      width="10"
                      height="10"
                      viewBox="0 0 8 8"
                      :color="sortColors.numberSortDescColor"
                      @click="sortElementList('number', 'DESC')"
                    >
                      <SortDesc />
                    </SvgBtn>
                  </div>
                </div>
                <!-- 체크 영역 -->
                <div
                  class="th d-flex"
                  style="width: 2.5rem; height: 2.25rem"
                  :style="{
                    backgroundColor: stores.ts.isDarkmode ? '#2d2d2d' : '',
                    border: stores.ts.isDarkmode
                      ? stores.ts.darkmodePalette.border
                      : '0.0625rem solid #e0e0e0',
                  }"
                />
              </div>
              <!-- 테이블 바디 -->
              <div
                class="element-table-body"
                style="width: 100%"
                :style="{
                  border: stores.ts.isDarkmode
                    ? stores.ts.darkmodePalette.border
                    : '0.0625rem solid #e0e0e0',
                }"
              >
                <!-- 구성요소 테이블 아이템 -->

                <draggable
                  v-model="workspaceStore.caseData.elements.list"
                  item-key="elementId"
                  handle=".handle"
                  @change="elementsTableChanged"
                >
                  <template #item="{ element, index }">
                    <div
                      v-if="element.itemType === 'E'"
                      v-init-tr
                      class="tr d-flex align-center text-400-14-black"
                      :style="{
                        borderBottom: stores.ts.isDarkmode
                          ? '0.0625rem solid #414141'
                          : '0.0625rem solid #dfdfdf',
                        overflowX: 'hidden',
                        whiteSpace: 'normal',
                        backgroundColor: getBackgroundColor(index),
                        lineHeight: '0.875rem',
                        color: stores.ts.isDarkmode ? 'white' : '',
                      }"
                      style="width: 100%; cursor: pointer"
                      :key="element.elementId"
                      @click="() => onclickTd(element, index)"
                      @mouseenter="(e) => onMouseEnterTr(e, element, index)"
                      @mouseleave="(e) => onMouseLeaveTr(e, index)"
                      @drag="onDragTr"
                      @dragend="onDragEndTr"
                    >
                      <div
                        class="td d-flex"
                        style="
                          padding: 0.5rem;
                          width: calc(75% + 0.0625rem);
                          line-height: 1.125rem;
                        "
                        :style="{
                          borderRight: stores.ts.isDarkmode
                            ? stores.ts.darkmodePalette.border
                            : '0.0625rem solid #e0e0e0',
                        }"
                      >
                        <!-- 드래그 핸들 -->
                        <div
                          class="handle d-flex align-center"
                          style="width: 1rem; height: 100%"
                        >
                          <IconBtn
                            color="#9E9E9E"
                            style="width: 1rem; height: 1rem; cursor: move"
                            :icon="mdiDragVertical"
                          />
                          <!-- 핸들 안보일 때 공간 확보하기 위한 박스 -->
                          <div style="width: 1rem" />
                        </div>
                        <!-- 명칭 td -->
                        <div
                          class="d-flex align-center"
                          v-html="element.name"
                        />
                      </div>
                      <!-- 숫자 td -->
                      <div
                        class="td d-flex"
                        style="
                          padding: 0.5rem;
                          width: calc(25% - 0.125rem);
                          height: 100%;
                        "
                        :style="{
                          borderRight: stores.ts.isDarkmode
                            ? stores.ts.darkmodePalette.border
                            : '0.0625rem solid #e0e0e0',
                        }"
                      >
                        <div v-html="element.number"></div>
                      </div>
                      <!-- 체크 td -->
                      <div
                        class="td d-flex"
                        style="
                          width: 2.5rem;
                          height: 100%;
                          padding-left: 0.25rem;
                        "
                      >
                        <IconBtn
                          v-if="
                            workspaceStore.caseData.elements.list[index]
                              ?.description
                          "
                          :icon="mdiCheck"
                          color="#5c6bc0"
                        />
                      </div>
                    </div>
                  </template>
                </draggable>
              </div>
            </div>
          </div>

          <div
            class="d-flex flex-column align-start justify-start mb-4"
            style="width: 50rem; padding-left: 1.5rem"
          >
            <div
              class="d-flex justify-space-between align-end mb-4"
              style="width: 100%"
            >
              <div
                class="text-bold-18-black"
                style="
                  width: 100%;
                  height: max-content;
                  padding: 1.5rem 1.5rem 0 0;
                "
                :style="{ color: Util.getColor(stores, 'PRIMARY') }"
                v-html="selectedElement.name"
              />
              <v-btn
                class="pa-0 px-2"
                style="color: white"
                flat
                :style="{
                  height: '2.25rem',
                  fontWeight: 400,
                  backgroundColor: Util.getColor(stores, 'BUTTON'),
                  color: Util.getColor(stores, 'BUTTON_TEXT'),
                }"
                :disabled="curElementIdx === -1"
                @click="asyncSaveElementDescription"
              >
                {{
                  Util.getI18NTxt(
                    stores,
                    "I18N/WORKSPACE/DETAILED_DESCRIPTION/ELEMENT_INPUT_WIZARD_SAVE_ELEMENT_DESCRIPTION"
                  )
                }}
              </v-btn>
            </div>
            <div class="element-description-editor-contents pa-4">
              <!-- 정의 타이틀 -->
              <div class="d-flex align-center text-400-12-gray mb-2">
                {{
                  Util.getI18NTxt(
                    stores,
                    "I18N/WORKSPACE/DETAILED_DESCRIPTION/ELEMENT_INPUT_WIZARD_DEFINITION"
                  )
                }}
                <div style="position: relative">
                  <IconBtn
                    class="ml-1"
                    :icon="mdiHelpCircleOutline"
                    @mouseenter="() => onMouseEnterTooltipBtn(0)"
                    @mouseleave="() => onMouseLeaveTooltipBtn(0)"
                  />
                  <!-- 에디터 툴팁 -->
                  <div
                    v-if="isShowTooltips[0]"
                    class="element-description-editor-tooltip-first"
                    v-html="
                      Util.getI18NTxt(
                        stores,
                        'I18N/WORKSPACE/DETAILED_DESCRIPTION/ELEMENT_INPUT_WIZARD_DEFINITION_SAMPLE'
                      )
                    "
                  />
                </div>
              </div>
              <!-- 정의 에디터 -->
              <div style="position: relative">
                <div
                  id="description-definition-toolbar"
                  style="position: absolute; top: -2.625rem; flex-wrap: nowrap"
                />
                <Editor
                  :disabled="elementDescriptionEditorDisabled"
                  id="description-definition"
                  :init="{
                    ...workspaceStore.tinymceConfig,
                    height: '100%',
                    setup: elementDescriptionEditorSetup,
                  }"
                  style="height: 4rem"
                  :style="[
                    {
                      padding: '0.625rem',
                      width: '100%',
                      border: themeStore.isDarkmode
                        ? '0.0625rem solid #414141'
                        : '0.0625rem solid #dfdfdf',
                      backgroundColor: 'white',
                    },
                  ]"
                  useAutocomplete
                />
              </div>

              <div class="d-flex align-center text-400-12-gray mt-4 mb-2">
                {{
                  Util.getI18NTxt(
                    stores,
                    "I18N/WORKSPACE/DETAILED_DESCRIPTION/ELEMENT_INPUT_WIZARD_RELATION"
                  )
                }}
                <div style="position: relative">
                  <IconBtn
                    class="ml-1"
                    :icon="mdiHelpCircleOutline"
                    @mouseenter="() => onMouseEnterTooltipBtn(1)"
                    @mouseleave="() => onMouseLeaveTooltipBtn(1)"
                  />
                  <!-- 에디터 툴팁 -->
                  <div
                    v-if="isShowTooltips[1]"
                    class="element-description-editor-tooltip"
                    v-html="
                      Util.getI18NTxt(
                        stores,
                        'I18N/WORKSPACE/DETAILED_DESCRIPTION/ELEMENT_INPUT_WIZARD_RELATION_SAMPLE'
                      )
                    "
                  />
                </div>
              </div>
              <!-- 다른 구성과의 유기적 결합관계 에디터 -->
              <div style="position: relative">
                <div
                  id="description-relation-toolbar"
                  style="position: absolute; top: -2.625rem; flex-wrap: nowrap"
                />
                <Editor
                  :disabled="elementDescriptionEditorDisabled"
                  id="description-relation"
                  :init="{
                    ...workspaceStore.tinymceConfig,
                    height: '100%',
                    setup: elementDescriptionEditorSetup,
                  }"
                  style="height: 4rem"
                  :style="[
                    {
                      padding: '0.625rem',
                      width: '100%',
                      border: themeStore.isDarkmode
                        ? '0.0625rem solid #414141'
                        : '0.0625rem solid #dfdfdf',
                      backgroundColor: 'white',
                    },
                  ]"
                  useAutocomplete
                />
              </div>
              <div class="d-flex align-center text-400-12-gray mt-4 mb-2">
                {{
                  Util.getI18NTxt(
                    stores,
                    "I18N/WORKSPACE/DETAILED_DESCRIPTION/ELEMENT_INPUT_WIZARD_FUNCTION"
                  )
                }}
                <div style="position: relative">
                  <IconBtn
                    class="ml-1"
                    :icon="mdiHelpCircleOutline"
                    @mouseenter="() => onMouseEnterTooltipBtn(2)"
                    @mouseleave="() => onMouseLeaveTooltipBtn(2)"
                  />
                  <!-- 에디터 툴팁 -->
                  <div
                    v-if="isShowTooltips[2]"
                    class="element-description-editor-tooltip"
                    v-html="
                      Util.getI18NTxt(
                        stores,
                        'I18N/WORKSPACE/DETAILED_DESCRIPTION/ELEMENT_INPUT_WIZARD_FUNCTION_SAMPLE'
                      )
                    "
                  />
                </div>
              </div>
              <!-- 기능 작용 효과 에디터 -->
              <div style="position: relative">
                <div
                  id="description-effect-toolbar"
                  style="position: absolute; top: -2.625rem; flex-wrap: nowrap"
                />
                <Editor
                  :disabled="elementDescriptionEditorDisabled"
                  id="description-effect"
                  :init="{
                    ...workspaceStore.tinymceConfig,
                    height: '100%',
                    setup: elementDescriptionEditorSetup,
                  }"
                  style="height: 4rem"
                  :style="[
                    {
                      padding: '0.625rem',
                      width: '100%',
                      border: themeStore.isDarkmode
                        ? '0.0625rem solid #414141'
                        : '0.0625rem solid #dfdfdf',
                      backgroundColor: 'white',
                    },
                  ]"
                  useAutocomplete
                />
              </div>
              <!-- 에디터 툴팁 -->

              <div class="d-flex justify-space-between align-center mt-4 mb-2">
                <div class="d-flex text-400-12-gray">
                  {{
                    Util.getI18NTxt(
                      stores,
                      "I18N/WORKSPACE/DETAILED_DESCRIPTION/ELEMENT_INPUT_WIZARD_EMBODIMENT"
                    )
                  }}
                  <div style="position: relative">
                    <IconBtn
                      class="ml-1"
                      :icon="mdiHelpCircleOutline"
                      @mouseenter="() => onMouseEnterTooltipBtn(3)"
                      @mouseleave="() => onMouseLeaveTooltipBtn(3)"
                    />
                    <div
                      v-if="isShowTooltips[3]"
                      class="element-description-editor-tooltip"
                      v-html="
                        Util.getI18NTxt(
                          stores,
                          'I18N/WORKSPACE/DETAILED_DESCRIPTION/ELEMENT_INPUT_WIZARD_EMBODIMENT_SAMPLE'
                        )
                      "
                    />
                  </div>
                </div>
              </div>
              <!-- 구체적 실시예 -->
              <div style="position: relative">
                <div
                  :id="`description-example0-toolbar`"
                  style="position: absolute; top: -2.625rem; flex-wrap: nowrap"
                />
                <Editor
                  :disabled="elementDescriptionEditorDisabled"
                  :id="`description-example0`"
                  :init="{
                    ...workspaceStore.tinymceConfig,
                    height: '100%',
                    setup: elementDescriptionEditorSetup,
                  }"
                  style="height: 4rem"
                  :style="[
                    {
                      padding: '0.625rem',
                      width: '100%',
                      border: themeStore.isDarkmode
                        ? '0.0625rem solid #414141'
                        : '0.0625rem solid #dfdfdf',
                      backgroundColor: 'white',
                    },
                  ]"
                  useAutocomplete
                />
              </div>
              <!-- 다른 예 -->
              <template
                v-for="(item, index) in selectedElement.description?.embodiment"
                :key="index"
              >
                <div v-if="index !== 0">
                  <div
                    class="d-flex justify-space-between align-center mt-4 mb-2"
                  >
                    <div class="d-flex text-400-12-gray">
                      {{
                        Util.getI18NTxt(
                          stores,
                          "I18N/WORKSPACE/DETAILED_DESCRIPTION/ELEMENT_INPUT_WIZARD_OTHER_EMBODIMENT"
                        )
                      }}
                    </div>
                    <IconBtn
                      @click="() => onClickDeleteExampleBtn(index)"
                      class="mr-2"
                      :icon="mdiTrashCan"
                      color="#7c7f90"
                    />
                  </div>

                  <div style="position: relative">
                    <div
                      :id="`description-example${index}-toolbar`"
                      style="
                        position: absolute;
                        top: -2.625rem;
                        flex-wrap: nowrap;
                      "
                    />
                    <Editor
                      :disabled="elementDescriptionEditorDisabled"
                      :id="`description-example${index}`"
                      :init="{
                        ...workspaceStore.tinymceConfig,
                        height: '100%',
                        setup: elementDescriptionEditorSetup,
                        callback: () => exampleEditorCallback(item, index),
                      }"
                      style="height: 4rem"
                      :style="[
                        {
                          padding: '0.625rem',
                          width: '100%',
                          border: themeStore.isDarkmode
                            ? '0.0625rem solid #414141'
                            : '0.0625rem solid #dfdfdf',
                          backgroundColor: 'white',
                        },
                      ]"
                      useAutocomplete
                    />
                  </div>
                </div>
              </template>

              <div
                class="desciption-example-add-btn d-flex justify-center align-center mt-4"
                @click="addExampleItem"
              >
                <IconBtn
                  class="mr-1"
                  borderRadius="50%"
                  :style="{
                    width: '1.5rem',
                    height: '1.5rem',
                    backgroundColor: '#5c6bc0',
                  }"
                  :icon="mdiPlus"
                  color="white"
                />
                <span :style="{ color: '#5c6bc0' }">{{
                  Util.getI18NTxt(
                    stores,
                    "I18N/WORKSPACE/DETAILED_DESCRIPTION/ELEMENT_INPUT_WIZARD_ADD_EMBODIMENT_BUTTON"
                  )
                }}</span>
              </div>
            </div>
            <div class="text-400-12-gray mt-4 mb-2">
              {{
                Util.getI18NTxt(
                  stores,
                  "I18N/WORKSPACE/DETAILED_DESCRIPTION/ELEMENT_INPUT_WIZARD_AUTO_GENERATED_TEXT"
                )
              }}
            </div>
            <!-- 삽입될 내용 -->
            <div style="width: 100%; height: 7.5625rem">
              <Editor
                inline
                :disabled="true"
                id="editor-insertion-description"
                :init="{
                  ...workspaceStore.tinymceInlineConfig,
                  height: '100%',
                  setup: elementDescriptionEditorSetup,
                  external_plugins: {
                    tiny_mce_wiris: `/wiris/mathtype-tinymce5/plugin.min.js`,
                  },
                  toolbar:
                    'bold italic underline strikethrough subscript superscript tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry charmap ',
                }"
                :style="[
                  {
                    height: '7.5625rem',
                    padding: '0.625rem',
                    marginBottom: '0.75rem',
                    borderRadius: '0.25rem',
                    backgroundColor: stores.ts.darkmodeBackgroundColor,
                    overflow: 'overlay',
                  },
                ]"
                useAutocomplete
              />
            </div>
          </div>
        </div>
      </Modal>

      <!-- 구성요소 추출기 모달 -->
      <DragModal
        ref="elementExtractCopyMagicianModal"
        :title="
          Util.getI18NTxt(
            stores,
            'I18N/WORKSPACE/DETAILED_DESCRIPTION/ELEMENT_EXTRACT_WIZARD_HEADER'
          )
        "
        buttonType="NY"
        :noTxt="Util.getI18NTxt(stores, 'I18N/BUTTON/CLOSE')"
        :noFunc="closeElementExtractCopyMagician"
        :closeFunc="closeElementExtractCopyMagician"
        :yesTxt="
          Util.getI18NTxt(
            stores,
            'I18N/WORKSPACE/DETAILED_DESCRIPTION/ELEMENT_EXTRACT_WIZARD_INSERT_BUTTON'
          )
        "
        :yesFunc="saveElementsExtracted"
        :top="100"
        :left="elExtractCpMagitModalLeft"
        :right="elExtCpMagitModalRight"
        opacityBar
        closeBtn
      >
        <!-- 마법사 모달 컨텐츠 -->
        <div
          class="element-extract-modal-body d-flex"
          style="padding-top: 1.5rem; width: 80rem; padding: 1.5rem"
          :style="{
            borderTop: stores.ts.isDarkmode
              ? stores.ts.darkmodePalette.border
              : '0.0625rem solid #e0e0e0',
          }"
        >
          <div
            style="padding-right: 1.5rem"
            :style="{
              borderRight: stores.ts.isDarkmode
                ? stores.ts.darkmodePalette.border
                : '0.0625rem solid #e0e0e0',
            }"
          >
            <div class="text-400-14-gray mb-4">
              {{
                Util.getI18NTxt(
                  stores,
                  "I18N/WORKSPACE/DETAILED_DESCRIPTION/ELEMENT_EXTRACT_WIZARD_TEXT"
                )
              }}
            </div>
            <div class="text-400-14-gray mb-4">
              {{
                Util.isKIPO(stores)
                  ? Util.getI18NTxt(
                      stores,
                      "I18N/WORKSPACE/DETAILED_DESCRIPTION/ELEMENT_EXTRACT_RULE_KIPO"
                    )
                  : Util.isJPO(stores)
                  ? Util.getI18NTxt(
                      stores,
                      "I18N/WORKSPACE/DETAILED_DESCRIPTION/ELEMENT_EXTRACT_RULE_JPO"
                    )
                  : Util.isUSPTO(stores)
                  ? Util.getI18NTxt(
                      stores,
                      "I18N/WORKSPACE/DETAILED_DESCRIPTION/ELEMENT_EXTRACT_RULE_USPTO"
                    )
                  : ""
              }}
            </div>
            <textarea
              class="el-extract-modal-text"
              v-model="textForElementsExtraction"
              style="
                width: 22rem;
                height: 31.25rem;
                borderradius: 0.25rem;
                padding: 0.625rem 0.75rem;
                overflow: auto;
                resize: none;
                outline: none;
              "
              :style="{
                border: stores.ts.isDarkmode
                  ? stores.ts.darkmodePalette.border
                  : '0.0625rem solid #e0e0e0',
                color: themeStore.darkmodeColor,
              }"
              :placeholder="
                Util.getI18NTxt(
                  stores,
                  'I18N/WORKSPACE/DETAILED_DESCRIPTION/ELEMENT_EXTRACT_WIZARD_TEXT_GUIDE'
                )
              "
            ></textarea>
          </div>
          <!-- 마법사 모달 듀얼리스트박스 -->
          <div
            class="d-flex flex-column align-start justify-center"
            style="width: 100%; margin: 0 1.5rem"
          >
            <div class="text-400-14-gray mb-4">
              {{
                Util.getI18NTxt(
                  stores,
                  "I18N/WORKSPACE/DETAILED_DESCRIPTION/ELEMENT_EXTRACT_WIZARD_EXTRACTED_LIST"
                )
              }}
            </div>
            <DuallistBox
              v-model="extractedElements"
              v-model:selected="selectedElements"
            />
          </div>
        </div>
      </DragModal>

      <!-- 관용어구 삽입기 모달 -->
      <Modal
        ref="idiomInsertionModal"
        :title="
          Util.getI18NTxt(
            stores,
            'I18N/WORKSPACE/DETAILED_DESCRIPTION/DROPDOWN_IDIOM_INSERT_WIZARD'
          )
        "
        buttonType="N"
        :noTxt="Util.getI18NTxt(stores, 'I18N/BUTTON/CLOSE')"
        closeBtn
        v-init-idiom-insertion-modal
      >
        <!-- 자주 사용하는 설명 -->
        <div class="idiom-insertion-modal-body">
          <!-- 검색바 -->
          <div
            class="idiom-insertion-modal-searchbar mb-4"
            :style="{
              borderBottom: stores.ts.isDarkmode
                ? '0.0625rem solid #414141'
                : '',
            }"
          >
            <v-icon
              color="grey"
              :style="{ position: 'absolute', left: '1rem', height: '2.5rem' }"
              :icon="mdiMagnify"
            />
            <input
              v-model="idiomSearchValue"
              class="autosave-idiom-searchbar"
              style="height: 2.5rem"
              :style="{
                paddingLeft: '2.625rem',
                color: stores.ts.isDarkmode
                  ? stores.ts.darkmodePalette.color
                  : '0.0625rem solid black',
                borderBottom: stores.ts.isDarkmode
                  ? stores.ts.darkmodePalette.border
                  : '0.0625rem solid #e0e0e0',
              }"
              type="text"
              :placeholder="Util.getI18NTxt(stores, 'I18N/BUTTON/SEARCH')"
            />
          </div>
          <div class="idiom-insertion-modal-contents">
            <template v-for="(item, index) in insertionIdioms" :key="item.id">
              <div
                v-if="
                  item.idiom_title.includes(idiomSearchValue) ||
                  item.idiom_contents.includes(idiomSearchValue)
                "
                class="d-flex flex-column align-center"
                style="width: 100%; border-bottom: 0.0625rem solid #e0e0e0"
                :style="{
                  borderBottom: stores.ts.isDarkmode
                    ? stores.ts.darkmodePalette.border
                    : '0.0625rem solid #e0e0e0',
                  color: stores.ts.isDarkmode
                    ? stores.ts.darkmodePalette.color
                    : '',
                }"
                @mouseenter="idiomsIndices[index] = true"
                @mouseleave="idiomsIndices[index] = false"
              >
                <div class="d-flex align-center mb-2" style="width: 100%">
                  <div
                    class="idiom-insertion-modal-card mr-2"
                    :style="{
                      width: '100%',
                      color: stores.ts.darkmodeColor,
                    }"
                    v-html="item.idiom_title"
                  />
                  <v-btn
                    v-if="idiomsIndices[index]"
                    class="pa-0 px-1"
                    :style="{
                      height: '1.875rem',
                      width: 'max-content',
                      color: Util.getColor(stores, 'BUTTON_TEXT'),
                      backgroundColor: Util.getColor(stores, 'BUTTON'),
                    }"
                    style="font-size: 0.75rem; color: white"
                    flat
                    @click="
                      () =>
                        asyncIdiomInsertionModalInsertBtn(
                          item.idiom_title,
                          item.idiom_contents
                        )
                    "
                  >
                    {{
                      Util.getI18NTxt(
                        stores,
                        "I18N/WORKSPACE/TOOLBAR/AI_SEARCH_MODAL_LIST_INSERT_BUTTON"
                      )
                    }}
                  </v-btn>
                </div>
                <div
                  class="idiom-insertion-modal-card mb-2"
                  :style="{
                    width: '100%',
                    color: stores.ts.isDarkmode
                      ? stores.ts.darkmodePalette.color
                      : '',
                  }"
                  v-html="item.idiom_contents"
                />
              </div>
            </template>
          </div>
        </div>
      </Modal>
    </teleport>
  </div>
</template>

<script lang="ts" setup>
import * as ElementHandler from "@/assets/javascripts/ipedit_element_handler";
import * as Util from "@/assets/javascripts/ipedit_util";
import { rgbToRgba } from "@/assets/javascripts/utils/css";
import IconBtn from "@/components/common/IconBtn.vue";
import SvgBtn from "@/components/common/SvgBtn.vue";
import DuallistBox from "@/components/DuallistBox.vue";
import type { DuallistItems } from "@/components/DuallistBox.vue";
import Modal from "@/components/common/modal/Modal.vue";
import DragModal from "@/components/common/modal/DragModal.vue";
import Editor from "@/components/workspace/Editor.vue";
import Divider from "@/components/Divider.vue";
// 스토어 import
import useAppStore from "@/store/useAppStore";
import useI18NStore from "@/store/useI18NStore";
import useModalStore from "@/store/useModalStore";
import useThemeStore from "@/store/useThemeStore";
import useUserStore from "@/store/useUserStore";
import useWorkspaceStore from "@/store/useWorkspaceStore";
import { useRouter } from "vue-router";
import type { ModalType } from "@/types/modal";
import {
  mdiClose,
  mdiHelpCircleOutline,
  mdiMenuDown,
  mdiOpenInNew,
  mdiPlus,
  mdiReorderVertical,
  mdiMagnify,
  mdiDragVertical,
  mdiSortClockAscendingOutline,
  mdiSortClockDescendingOutline,
  mdiCheck,
  mdiTrashCan,
} from "@mdi/js";
import tinymce from "tinymce/tinymce";
import type { Editor as EditorType } from "tinymce/tinymce";
import { computed, onMounted, ref, watch, type Directive } from "vue";
import type { Ref } from "vue";
import type { ElementData, IdiomData } from "@/types/case";
import Draggable from "vuedraggable";
import {
  asyncDebounce,
  asyncDelay,
} from "@/assets/javascripts/utils/asyncDebounce";
import SortAsc from "@/assets/svgs/sortAsc.vue";
import SortDesc from "@/assets/svgs/sortDesc.vue";
import { tldexie } from "@/assets/javascripts/dexie";
import { storeToRefs } from "pinia";
import type { IIComponentSpinner } from "@/types/component";
import IComponentSpinner from "@/components/IComponentSpinner.vue";
import { extractElements } from "@/assets/javascripts/workspace/extractation";
import type { ExtractedElement } from "@/assets/javascripts/workspace/extractation/common";

const props = defineProps<{
  modelValue?: boolean;
}>();

const emit = defineEmits(["update:modelValue"]);
const modelValue = ref(props.modelValue);

// 스토어
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

// 레이아웃
const isComponentDrag = ref(false);
const description = ref<HTMLElement>();
const descriptionSpinner = ref<IIComponentSpinner>();

// 상세한 설명 셀렉트 값
const elExtractCpMagitModalLeft = ref(0);

// 마법사 셀렉트 옵션
const isHoverTitleDownIcon = ref(false);

/**구성요소 설명 입력 마법사 모달 */
const elementDescriptionEditor = ref<ModalType>();
const elDescInputMagitRight = ref(false);

// 마우스가 테이블 내에 있는지 여부
const isMouseEnterTr = ref(false);
const elTableHoverIndices = ref<boolean[]>([]);
const trBacgroundColor = ref<string[]>([]);

// 에디터 사용 가능 유무
const elementDescriptionEditorDisabled = ref(true);

// 드래그할 때 호버 색상 하얀색/지정한 색
const isElDrag = ref(false);

// 툴팁 보이는 유무
const isShowTooltips = ref<boolean[]>([false, false, false]);
// 구성요소 점검 스위치
const checkElement = ref(false);
// 청구범위 등장횟수
const elementCountInClaims = ref(0);
const elementCountInClaimsArray = ref<number[]>([]);
// 그외 등장횟수
const elementCountInDescription = ref(0);
const elementCountInDescriptionArray = ref<number[]>([]);

// 구성요소 테이블 선택한 구성요소 인덱스
const curElementIdx = ref(-1);
// 선택된 구성요소 초기화
const selectedElement = ref<ElementData>({
  elementId: "",
  itemType: "", // E: 구성요소 항목, I: 관용어 항목
  inputOrder: 0,
  number: "",
  name: Util.getI18NTxt(
    stores,
    "I18N/WORKSPACE/DETAILED_DESCRIPTION/ELEMENT_INPUT_WIZARD_ELEMENT_NAME_PLACEHOLDER"
  ),
  autocompleteText: "",
  description: {
    definition: "",
    relation: "",
    effect: "",
    embodiment: [""],
    generatedTxt: "",
  },
});

// 구성요소 테이블 아이템 추가시 효과 주기 위한 플래그
let elementTableMounted = false;

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

// tinymceConfig
const tinymceConfig = ref({});
// 새탭인 경우에는 localStorage에서 가져옴
if (router.currentRoute.value.path.indexOf("wtab") > 0) {
  let savedConfig = localStorage.getItem("editorConfig") as string;
  // darkmode인 경우에는 wiris 수식 색 반전
  if (themeStore.isDarkmode)
    savedConfig = savedConfig.replace("$invert$", "invert(100%)");
  // 일반 모드면 원상 복귀
  else savedConfig = savedConfig.replace("invert(100%)", "$invert$");

  tinymceConfig.value = JSON.parse(savedConfig);
}
// 일반적인 경우에는 workspaceStore 변수 사용
else {
  // darkmode인 경우에는 wiris 수식 색 반전
  if (themeStore.isDarkmode)
    workspaceStore.tinymceConfig.content_style =
      workspaceStore.tinymceConfig.content_style.replace(
        "$invert$",
        "invert(100%)"
      );
  // 일반 모드면 원상 복귀
  else
    workspaceStore.tinymceConfig.content_style =
      workspaceStore.tinymceConfig.content_style.replace(
        "invert(100%)",
        "$invert$"
      );

  tinymceConfig.value = workspaceStore.tinymceConfig;
}

// 스토어 초기화 여부
const {
  initializeWorkspace,
  initializeDescriptionArea,
  requestSaveDescription,
  refreshDescription,
} = storeToRefs(workspaceStore);

// 컴포넌트 마운트 여부
const isMounted = ref(false);

// 에디터 초기화 여부
const editorInitialized = ref(false);

function elementDescriptionEditorSetup(editor: EditorType) {
  editor.on("focusout", setSelectedElement);
}

const onClickDeleteExampleBtn = (idx: number) =>
  selectedElement.value.description?.embodiment?.splice(idx, 1);

function setEditorsTxtInElementDescriptionEditor(element: ElementData) {
  const definition = element.description?.definition
    ? element.description.definition
    : "";
  const relation = element.description?.relation
    ? element.description.relation
    : "";
  const effect = element.description?.effect ? element.description.effect : "";

  let generatedTxt = definition + relation + effect;

  if (element.description?.embodiment?.length)
    element.description?.embodiment.forEach((embodiment) => {
      generatedTxt += embodiment;
    });

  selectedElement.value.description = {
    definition: definition,
    relation: relation,
    effect: effect,
    embodiment: element.description?.embodiment?.length
      ? element.description?.embodiment
      : [""],
    generatedTxt: generatedTxt,
  };

  const embodiment = selectedElement.value.description?.embodiment;
  const firstEmbodiment = embodiment?.length ? embodiment[0] : "";

  // 에디터 값 세팅
  tinymce.get("description-definition").setContent(definition);
  tinymce.get("description-relation").setContent(relation);
  tinymce.get("description-effect").setContent(effect);
  tinymce.get("description-example0").setContent(firstEmbodiment);
}

const exampleEditorCallback = (example: string | undefined, idx: number) => {
  example = example ? example : "";
  tinymce.get(`description-example${idx}`).setContent(example);
};

function setSelectedElement() {
  // 각 구성요소 텍스트를 가져옴
  const definitionTxt = tinymce.get("description-definition").getContent();
  const relationTxt = tinymce.get("description-relation").getContent();
  const effectTxt = tinymce.get("description-effect").getContent();
  // console.log(definitionTxt, relationTxt, effectTxt);
  if (selectedElement.value.description) {
    // 선택된 구성요소에 값 갱신
    selectedElement.value.description.definition = definitionTxt;
    selectedElement.value.description.relation = relationTxt;
    selectedElement.value.description.effect = effectTxt;
    selectedElement.value.description.generatedTxt =
      definitionTxt + relationTxt + effectTxt;
  }

  // 에디터 값들 갱신
  const embodiment = selectedElement.value.description?.embodiment;
  if (embodiment?.length)
    for (let i = 0; i < embodiment.length; i++) {
      const exampleTxt = tinymce.get(`description-example${i}`).getContent();
      selectedElement.value.description.embodiment[i] = exampleTxt;
      selectedElement.value.description.generatedTxt += exampleTxt;
    }
  tinymce
    .get("editor-insertion-description")
    .setContent(selectedElement.value.description?.generatedTxt as string);
}

// 구성요소에 설명 저장
async function saveElementDescription() {
  setSelectedElement();
  // 스토어의 구성요소 값 갱신
  workspaceStore.caseData.elements.list[curElementIdx.value] =
    selectedElement.value;

  // 스토어 배열에 등록 성공

  // tldexie 저장
  const updateResult = await tldexie.updateLayeredData(
    workspaceStore.active_save_slot,
    "elements",
    JSON.stringify(workspaceStore.caseData.elements)
  );

  if (updateResult) {
    // 구성요소 변경 상태 업데이트
    workspaceStore.isElementAdded = true;

    workspaceStore.showSnackbar(
      Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/SAVE_SUCCESSED").replace(
        "$DATA$",
        Util.getI18NTxt(stores, "I18N/WORKSPACE/ELEMENTS_LIST/TITLE")
      ),
      "info"
    );
  } else {
    workspaceStore.showSnackbar(
      Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/SAVE_FAILED").replace(
        "$DATA$",
        Util.getI18NTxt(stores, "I18N/WORKSPACE/ELEMENTS_LIST/TITLE")
      ),
      "error"
    );
  }
}

const asyncSaveElementDescription = asyncDebounce(
  saveElementDescription,
  asyncDelay
);

// Tr로부터 높이를 구해서 Tr의 스타일에 적용함
function setTdHeightFromTr(el: HTMLElement) {
  // 구성요소 테이블 행 업데이트 될 때 양쪽 높이 맞춰주기
  let leftChildren: HTMLElement = el.children[0] as HTMLElement;
  let rightChildren: HTMLElement = el.children[1] as HTMLElement;
  let style = window.getComputedStyle(el);
  leftChildren.style.height = "";
  rightChildren.style.height = "";
  leftChildren.style.height = style.height;
  rightChildren.style.height = style.height;
  leftChildren.style.padding = "0.5rem";
  rightChildren.style.padding = "0.5rem";
}

const vInitElDescEditor: Directive = {
  mounted() {
    // 에디터가 켜질 때 변수 초기화
    // 선택된 구성요소 초기화
    selectedElement.value = {
      elementId: "",
      itemType: "", // E: 구성요소 항목, I: 관용어 항목
      inputOrder: 0,
      number: "",
      name: Util.getI18NTxt(
        stores,
        "I18N/WORKSPACE/DETAILED_DESCRIPTION/ELEMENT_INPUT_WIZARD_ELEMENT_NAME_PLACEHOLDER"
      ),
      autocompleteText: "",
      description: {
        definition: "",
        relation: "",
        effect: "",
        embodiment: [""],
        generatedTxt: "",
      },
    };
    curElementIdx.value = -1;
    elementDescriptionEditorDisabled.value = true;
  },
};

// Tr mounted될 때 실행되는 디렉티브
const vInitTr: Directive = {
  mounted(el: HTMLElement) {
    // 테이블 양쪽 높이 맞춰주기
    setTdHeightFromTr(el);
    // 마운트된 후에 아이템이 성공적으로 추가 되었으면 배경색 변경
    if (elementTableMounted) {
      el.style.backgroundColor = "rgba(92, 107, 196, 0.4)";
      el.style.transition = "all 0.3s ease-in-out";
      setTimeout(() => {
        el.style.backgroundColor = "white";
        el.style.transition = "";
      }, 1000);
    }
  },
};

// 구성요소 정렬 버튼을 위한 변수
const sortColors = ref<{ [key: string]: string }>({
  nameSortAscColor: "#9E9E9E",
  nameSortDescColor: "#9E9E9E",
  inputOrderSortColor: "#9E9E9E",
  inputOrderSort:
    workspaceStore.caseData.elements.orderKey === "inputOrder"
      ? workspaceStore.caseData.elements.order
      : "DESC",
  numberSortAscColor: "#9E9E9E",
  numberSortDescColor: "#9E9E9E",
});

// 구성요소 리스트 시간순 정렬 버튼 색
// 아이콘 명과 반대로 사용중, ASC아이콘의 화살표 방향이 DESC 같기 때문
// mdiSortClockAscendingOutline -> DESC 상태
const inputOrderBtnIcon = computed(() => {
  if (workspaceStore.caseData.elements.orderKey === "inputOrder")
    if (workspaceStore.caseData.elements.order === "DESC")
      return mdiSortClockAscendingOutline;
    else return mdiSortClockDescendingOutline;
  return mdiSortClockAscendingOutline;
});

// 구성요소 리스트 정렬
function setupSortIcons() {
  const colorObject = {
    nameSortAscColor: "#9E9E9E",
    nameSortDescColor: "#9E9E9E",
    inputOrderSortColor: "#9E9E9E",
    inputOrderSort:
      workspaceStore.caseData.elements.orderKey === "inputOrder"
        ? workspaceStore.caseData.elements.order
        : "DESC",
    numberSortAscColor: "#9E9E9E",
    numberSortDescColor: "#9E9E9E",
  };

  if (
    workspaceStore.caseData.elements.orderKey === "inputOrder" &&
    workspaceStore.caseData.elements.order === "DESC"
  ) {
    colorObject.inputOrderSortColor = stores.ts.isDarkmode
      ? "white"
      : "#212121";
    colorObject.inputOrderSort = "ASC";
  } else if (
    workspaceStore.caseData.elements.orderKey === "inputOrder" &&
    workspaceStore.caseData.elements.order === "ASC"
  ) {
    colorObject.inputOrderSortColor = stores.ts.isDarkmode
      ? "white"
      : "#212121";
    colorObject.inputOrderSort = "DESC";
  } else if (
    workspaceStore.caseData.elements.orderKey === "name" &&
    workspaceStore.caseData.elements.order === "DESC"
  ) {
    colorObject.nameSortDescColor = stores.ts.isDarkmode ? "white" : "#212121";
  } else if (
    workspaceStore.caseData.elements.orderKey === "name" &&
    workspaceStore.caseData.elements.order === "ASC"
  ) {
    colorObject.nameSortAscColor = stores.ts.isDarkmode ? "white" : "#212121";
  } else if (
    workspaceStore.caseData.elements.orderKey === "number" &&
    workspaceStore.caseData.elements.order === "DESC"
  ) {
    colorObject.numberSortDescColor = stores.ts.isDarkmode
      ? "white"
      : "#212121";
  } else if (
    workspaceStore.caseData.elements.orderKey === "number" &&
    workspaceStore.caseData.elements.order === "ASC"
  ) {
    colorObject.numberSortAscColor = stores.ts.isDarkmode ? "white" : "#212121";
  }

  sortColors.value.nameSortAscColor = colorObject.nameSortAscColor;
  sortColors.value.nameSortDescColor = colorObject.nameSortDescColor;
  sortColors.value.inputOrderSortColor = colorObject.inputOrderSortColor;
  sortColors.value.inputOrderSort = colorObject.inputOrderSort;
  sortColors.value.numberSortAscColor = colorObject.numberSortAscColor;
  sortColors.value.numberSortDescColor = colorObject.numberSortDescColor;
}

// 구성요소 리스트 덱시에 저장 및 아이콘 세팅
async function sortElementList(orderKey: string, order: string) {
  workspaceStore.caseData.elements.orderKey = orderKey;
  workspaceStore.caseData.elements.order = order;

  if (workspaceStore.caseData.elements.orderKey === "inputOrder") {
    Util.sortObjectArray(
      workspaceStore.caseData.elements.list,
      orderKey,
      "number",
      workspaceStore.caseData.elements.order
    );
  } else {
    Util.sortObjectArray(
      workspaceStore.caseData.elements.list,
      orderKey,
      "string",
      workspaceStore.caseData.elements.order
    );
  }

  // tldexie 저장
  await tldexie.updateLayeredData(
    workspaceStore.active_save_slot,
    "elements",
    JSON.stringify(workspaceStore.caseData.elements)
  );

  setupSortIcons();
}

interface DraggableMoved {
  element: ElementData;
  newIndex: number;
  oldIndex: number;
}

// 드래그 되었을 때 데이터 저장
async function elementsTableChanged(e: { moved: DraggableMoved }) {
  try {
    // tldexie 저장
    await tldexie.updateLayeredData(
      workspaceStore.active_save_slot,
      "elements",
      JSON.stringify(workspaceStore.caseData.elements)
    );

    //
    const moved = e.moved;
    curElementIdx.value = moved.newIndex;
    selectedElement.value = moved.element;
  } catch (e) {
    console.error("덱시 저장 에러", e);
  }
}

function getBackgroundColor(index: number) {
  let returnColor = "";
  if (curElementIdx.value === index)
    returnColor = Util.getColor(stores, "TINTED");

  if (themeStore.isDarkmode) returnColor = "#1E1E1E";

  if (checkElement.value && trBacgroundColor.value[index] !== "")
    returnColor = trBacgroundColor.value[index];

  if (elTableHoverIndices.value[index])
    returnColor = Util.getColor(stores, "TINTED");

  return returnColor;
}

// 구성요소 드래그 할 때 배경화면을 바꿔주기 위한 함수들
const onDragTr = (e: MouseEvent) => {
  isElDrag.value = true;
  let target = e.target as HTMLElement;
  target.style.backgroundColor = rgbToRgba("#5c6bc0", ".1");
  isMouseEnterTr.value = false;
};

const onDragEndTr = (e: MouseEvent) => {
  elTableHoverIndices.value.length = 0;
  isElDrag.value = false;
  let target = e.target as HTMLElement;
  target.style.backgroundColor = "";
};

function onclickTd(element: ElementData, idx: number) {
  // 다른 구성요소 클릭하면 자동저장
  workspaceStore.caseData.elements.list[curElementIdx.value] =
    selectedElement.value;
  curElementIdx.value = idx;
  selectedElement.value = { ...element };
  // 에디터 disabled 해제
  elementDescriptionEditorDisabled.value = false;
  // description이 있으면 데이터 초기화
  setEditorsTxtInElementDescriptionEditor(element);
}

const onMouseEnterTr = (e: MouseEvent, element: ElementData, index: number) => {
  if (!isElDrag.value) isMouseEnterTr.value = true;
  elTableHoverIndices.value[index] = true;

  elementCountInClaims.value = elementCountInClaimsArray.value[index];
  elementCountInDescription.value = elementCountInDescriptionArray.value[index];
};

const onMouseLeaveTr = (e: MouseEvent, index: number) => {
  isMouseEnterTr.value = false;
  elTableHoverIndices.value[index] = false;

  if (checkElement.value) {
    elementCountInClaims.value = 0;
    elementCountInDescription.value = 0;
  }
};

function onClickYesBtnInElDescEditor() {
  tinymce
    .get("detailed-description")
    .selection.setContent(
      selectedElement.value.description?.generatedTxt as string
    );
  //삽입되는 위치에 <br/>이 하나 들어가서 delete 한번 실행함
  tinymce.get("detailed-description").execCommand("Delete");

  workspaceStore.showSnackbar(
    Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/SAVE_SUCCESSED").replace(
      "$DATA$",
      Util.removePTag(selectedElement.value.name)
    ),
    "success"
  );
}

/** 구성요소추출복사마법사 모달 부분 */
const textForElementsExtraction = ref("");
const elementExtractCopyMagicianModal = ref<HTMLElement & ModalType>();
const elExtCpMagitModalRight = ref(false);
const elDescInputMagitLeft = ref<number>(0);
const extractedElements: Ref<DuallistItems<ExtractedElement>> = ref([]);
const selectedElements: Ref<DuallistItems<ExtractedElement>> = ref([]);

function closeArea() {
  if (!isReadonlyWindow.value) {
    workspaceStore.controlAreaShow("description");
    workspaceStore.initializeToolbar = true;
  } else {
    window.close();
  }
}

const openElDescInputMagicianModal = () => {
  isHoverTitleDownIcon.value = false;
  elementDescriptionEditor.value?.show();
};

function openElementExtractCopyMagician() {
  textForElementsExtraction.value = "";
  extractedElements.value = [];
  selectedElements.value = [];
  isHoverTitleDownIcon.value = false;
  elementExtractCopyMagicianModal.value?.show();
}
function closeElementExtractCopyMagician() {
  elementExtractCopyMagicianModal.value?.hide();
}

// 새탭 열기 버튼 클릭 시
function openNewTabBtn() {
  localStorage.setItem("tabFrom", "description");
  localStorage.setItem(
    "editorConfig",
    JSON.stringify(workspaceStore.tinymceConfig)
  );

  window.open(
    "wtab",
    "description",
    `width=${Math.ceil(window.screen.availWidth / 2)}, height=${
      window.screen.availHeight
    }, menubar=no, status=no, toolbar=no, location=no`
  );
}

function getDescriptionAreaTitle() {
  if (Util.isSplitLayout(stores))
    if (Util.isPCT(stores))
      return Util.getI18NTxt(
        stores,
        "I18N/WORKSPACE/DETAILED_DESCRIPTION/TITLE_PCT"
      );
    else
      return Util.getI18NTxt(
        stores,
        "I18N/WORKSPACE/DETAILED_DESCRIPTION/TITLE"
      );
  else
    return Util.getI18NTxt(
      stores,
      workspaceStore.caseMasterData.work_type_code_path,
      "setting_titles"
    );
}

const addExampleItem = () => {
  selectedElement.value.description?.embodiment?.push("");
};

// 툴팁의 인덱스 설정
const onMouseEnterTooltipBtn = (idx: number) =>
  (isShowTooltips.value[idx] = true);

// 툴팁 가림
const onMouseLeaveTooltipBtn = (idx: number) =>
  (isShowTooltips.value[idx] = false);

/**관용구 삽입기 구현부 */
const idiomInsertionModal = ref<ModalType>();
const insertionIdioms = ref<IdiomData[]>([]);
const DR_IDIOM_CUSTOM = "DR_IDIOM/CUSTOM";
const idiomSearchValue = ref("");
// const isSelectedFrequentlyIdiomCards = ref<boolean[]>([]);

// 관용구 호버 인덱스
const idiomsIndices = ref<boolean[]>([]);

// 자주 사용하는 관용구 데이터 복사
const vInitIdiomInsertionModal: Directive = {
  created() {
    insertionIdioms.value = [];
    workspaceStore.idioms.forEach((idiom) => {
      if (idiom.dr_idiom_code_path === DR_IDIOM_CUSTOM)
        insertionIdioms.value.push(idiom);
    });
  },
};
// 삽입 버튼 클릭 시
async function idiomInsertionModalInsertBtn(
  idiomTitle: string,
  idiomContents: string
) {
  tinymce.get("detailed-description").selection.setContent(idiomContents);
  //삽입되는 위치에 <br/>이 하나 들어가서 delete 한번 실행함
  tinymce.get("detailed-description").execCommand("Delete");

  workspaceStore.showSnackbar(
    Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/SAVE_SUCCESSED").replace(
      "$DATA$",
      idiomTitle
    ),
    "success"
  );

  idiomInsertionModal.value?.hide();
}
const asyncIdiomInsertionModalInsertBtn = asyncDebounce(
  idiomInsertionModalInsertBtn,
  asyncDelay
);

function dragStart(e: DragEvent) {
  // props에 watch 붙어 있는게 정상 작동 안해서 강제로 드래그 시작 시 false됨
  modelValue.value = false;
  workspaceStore.areaDragStart(e);
}

function dragEnd(e: DragEvent) {
  workspaceStore.areaDragEnd(e);
  modelValue.value = true;
}

function insertIdiom() {
  isHoverTitleDownIcon.value = false;
  idiomInsertionModal.value?.show();

  // 데이터 넣는 것
  // tinymce.activeEditor.selection.setContent("테스트다");
}

function setupDescriptionData() {
  if (workspaceStore.caseData.detailed_description.data === undefined) {
    appStore.offSpin();
    Util.openAlertModal(
      stores,
      Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/DB_ALERT")
    );
    router.push("/draft/dashboard");

    // TODO: 에러 리포팅
    console.error("데이터 없음");
    return;
  }

  if (tinymce.get("detailed-description")) {
    tinymce
      .get("detailed-description")
      .setContent(workspaceStore.caseData.detailed_description.data);
  }

  descriptionSpinner.value?.offSpin();
}

const editorSetup = (editor: EditorType) => {
  // 새창이면 readonly로 셋팅
  if (isReadonlyWindow.value) {
    editor.mode.set("readonly");
  }

  editor.on("keydown", function (e: KeyboardEvent) {
    if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      e.stopPropagation();
      debounceSaveDescriptionSpinner();
    } else if (e.key === "F5") {
      e.preventDefault();
      e.stopPropagation();
    }
  });
};

// 덱시에 에디터 데이터 저장하고 성공 유무에 따라 스낵바 보여줌
async function saveDescription() {
  workspaceStore.caseData.detailed_description.data = tinymce
    .get("detailed-description")
    .getContent();

  // tldexie 저장
  const result = await tldexie.updateLayeredData(
    workspaceStore.active_save_slot,
    "detailed_description",
    JSON.stringify(workspaceStore.caseData.detailed_description)
  );

  if (result) {
    workspaceStore.showSnackbar(
      Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/SAVE_SUCCESSED").replace(
        "$DATA$",
        Util.getI18NTxt(stores, "I18N/WORKSPACE/DETAILED_DESCRIPTION/TITLE")
      ),
      "info"
    );

    // 구조창 새로 고침
    workspaceStore.initializeStructureArea = true;
  } else
    workspaceStore.showSnackbar(
      Util.getI18NTxt(stores, "I18N/COMMON/MESSAGE/SAVE_FAILED").replace(
        "$DATA$",
        Util.getI18NTxt(stores, "I18N/WORKSPACE/DETAILED_DESCRIPTION/TITLE")
      ),
      "error"
    );
}

const asyncSaveDescription = asyncDebounce(saveDescription);

const debounceSaveDescriptionSpinner = () =>
  descriptionSpinner.value?.setSpinner(asyncSaveDescription, "translucent")();

// props가 바뀔 때(부모에서 값이 바뀔 때)
watch(props, () => {
  modelValue.value = props.modelValue;
});

// modelValue가 바뀔 때(컴포넌트 내부에서 값이 바뀔 때)
watch(modelValue, () => {
  emit("update:modelValue", modelValue.value);
});

// 상세한 설명 저장 요청 시 -> 구성요소 점검 시작할 때 데이터를 저장할 필요가 있어서 저장요청함
watch(requestSaveDescription, () => {
  if (requestSaveDescription.value) {
    debounceSaveDescriptionSpinner();
    requestSaveDescription.value = false;
  }
});

// 스토어와 에디터가 모두 초기화되었을 때, 에디터 데이터 셋업해 줌
// e.g. 워크스페이스 진입
watch([initializeDescriptionArea, editorInitialized], () => {
  if (initializeDescriptionArea.value && editorInitialized.value) {
    setupDescriptionData();
    initializeWorkspace.value = false;
    initializeDescriptionArea.value = false;
    editorInitialized.value = false;
  }
});

// 스토어 초기화는 없고, 마운트와 에디터가 모두 초기화되었을 때
// e.g. 드래그, 컴포넌트 크기 조절
watch([initializeWorkspace, isMounted, editorInitialized], () => {
  if (
    !initializeWorkspace.value &&
    isMounted.value &&
    editorInitialized.value
  ) {
    setupDescriptionData();
    isMounted.value = false;
    editorInitialized.value = false;
  }
});

// 강제 새로고침
// e.g. 다른 컴포넌트에서 요청
watch(refreshDescription, () => {
  if (refreshDescription) {
    setupDescriptionData();
    refreshDescription.value = false;
  }
});

// 텍스트에서 구성요소 추출
watch(textForElementsExtraction, (newVal: string) => {
  // 빠른 종료
  if (newVal === "") {
    return;
  }

  // 추출 시작
  let result;
  if (workspaceStore.caseMasterData.format_code_path === "FORMAT/KIPO") {
    result = extractElements(newVal, "ko");
  } else if (
    workspaceStore.caseMasterData.format_code_path === "FORMAT/USPTO"
  ) {
    result = extractElements(newVal, "en");
  } else if (workspaceStore.caseMasterData.format_code_path === "FORMAT/JPO") {
    result = extractElements(newVal, "ja");
  }

  // 추출 데이터 입력
  extractedElements.value = [];

  for (const element of result as ExtractedElement[]) {
    let key = "";
    let replaceTxt = "";

    if (Util.isKIPO(stores)) key = element.el + "(" + element.num + ")";
    else if (Util.isJPO(stores)) key = element.el + element.num;
    else if (Util.isUSPTO(stores)) key = element.el + " " + element.num;

    // 도면부호가 없는데, 앞에서 한번 등장했던 구성요소이면 추출된 구성요소로 넣지 않고 pass
    if (element.num === "-") {
      let isExist = false;
      for (const item of extractedElements.value) {
        if (item.data.el.trim() === element.el.trim()) {
          isExist = true;
          break;
        }
      }
      if (isExist) continue;
    }

    replaceTxt = element.num === "-" ? element.el : key;

    const count = textForElementsExtraction.value.split(replaceTxt).length - 1;

    const candidate = {
      text: key,
      key: key,
      data: element,
      replaceTxt: replaceTxt,
      replaceTxt_length: replaceTxt.length,
      count: count,
    };
    extractedElements.value.push(candidate);
  }
});

// 구성요소 저장후 삽입하기
async function saveElementsExtracted() {
  let insertHtml = textForElementsExtraction.value;
  insertHtml = "<p>" + Util.replaceAll(insertHtml, "\n", "</p><p>") + "</p>";

  const tempSelectedElement = JSON.parse(
    JSON.stringify(selectedElements.value)
  );

  tempSelectedElement.sort(function (b: any, a: any) {
    return a["replaceTxt_length"] - b["replaceTxt_length"];
  });

  // 선택된 구성요소들 저장
  for (const element of tempSelectedElement) {
    const data: ExtractedElement = element.data;

    if (data.num === "-") data.num = "";

    //중복된거 있으면 알아서 걸러짐
    const addResult = ElementHandler.addElement(
      workspaceStore.caseData.elements,
      "<p>" + data.el.trim() + "</p>",
      "<p>" + data.num.trim() + "</p>"
    );

    // 정상 등록됨
    if (addResult === 200) {
      let addedElement = workspaceStore.caseData.elements.list[0];

      const tagID =
        addedElement.elementId +
        "-" +
        Util.getTimeStamp() +
        "-" +
        Math.random().toString(36).substr(2, 11);

      let autocompleteTag = "";
      if (Util.isKIPO(stores))
        autocompleteTag = Util.makeAutocompleteTag(
          addedElement,
          workspaceStore.caseMasterData.format_code_path,
          "TYPE1",
          tagID,
          false,
          false
        );
      else if (Util.isJPO(stores))
        autocompleteTag = Util.makeAutocompleteTag(
          addedElement,
          workspaceStore.caseMasterData.format_code_path,
          "TYPE3",
          tagID,
          false,
          false
        );
      // TODO: 대소문자 변경 처리, 단복수 처리 등
      // TODO: 영어 뿐만 아니라, 태그를 구성하는 text에 들어가 있는 문자들(data, name, autocomplete 등)이 구성요소도 들어올 때의 처리 필요함
      else if (Util.isUSPTO(stores))
        autocompleteTag = Util.makeAutocompleteTag(
          addedElement,
          workspaceStore.caseMasterData.format_code_path,
          "TYPE4",
          tagID,
          false,
          false
        );

      const tempArray = insertHtml.split(element.replaceTxt);
      let tempHtml = "";

      for (let i = 0; i < tempArray.length; i++) {
        tempHtml = tempHtml + tempArray[i];

        if (i !== tempArray.length - 1) {
          const spanOpenIndex = tempArray[i].lastIndexOf('<span id="el');
          const classIndex = tempArray[i].lastIndexOf('class="autocomplete');
          const spanCloseIndex = tempArray[i].lastIndexOf("</span>");

          // openIndex가 더 크다는 얘기는 span이 열렸는데 안닫혔다는 것임 --> 태그 내에서 발견된 경우
          if (spanOpenIndex > spanCloseIndex)
            tempHtml = tempHtml + element.replaceTxt;
          // 앞에 안걸리고, classIndex가 더 크다는 얘기는 자동완성된 텍스트라는 것임
          else if (classIndex > spanCloseIndex)
            tempHtml = tempHtml + element.replaceTxt;
          else tempHtml = tempHtml + autocompleteTag;
        }
      }

      insertHtml = tempHtml;
    }
  }

  tinymce.get("detailed-description").selection.setContent(insertHtml);

  // tldexie 저장
  await tldexie.updateLayeredData(
    workspaceStore.active_save_slot,
    "elements",
    JSON.stringify(workspaceStore.caseData.elements)
  );

  debounceSaveDescriptionSpinner();

  closeElementExtractCopyMagician();
}
const { isDarkmode } = storeToRefs(themeStore);

// 다크모드 스위칭 될 때 detailed-description css 바꿔줌
// TODO: 에디터 초기화 로직에 맞게 수정해야 될 것 같음
watch(isDarkmode, (isDarkmode) => {
  if (isDarkmode) {
    tinymce.get("detailed-description").contentWindow.document.head.innerHTML =
      tinymce
        .get("detailed-description")
        .contentWindow.document.head.innerHTML.replace(
          "$invert$",
          "invert(100%)"
        );
  } else {
    tinymce.get("detailed-description").contentWindow.document.head.innerHTML =
      tinymce
        .get("detailed-description")
        .contentWindow.document.head.innerHTML.replace(
          "invert(100%)",
          "$invert$"
        );
  }
});

// Editor.vue에서 tinymce init이 완료된 후 실행할 함수
const editorInitCallback = () => {
  // 아래 3줄 -> 입력된 내용 맨 뒤에 포커스 줌
  tinymce.activeEditor.focus();
  tinymce.activeEditor.selection.select(tinymce.activeEditor.getBody(), true);
  tinymce.activeEditor.selection.collapse(false);

  // watch 설정
  editorInitialized.value = true;
};

// onBeforeUnmount(() => {});

onMounted(() => {
  console.log("description mounted");

  isMounted.value = true;
  descriptionSpinner.value?.onSpin();
});
</script>

<style lang="scss" scoped>
@import "@/styles/draft/text";

::v-deep(.tox .tox-editor-header) {
  z-index: 0 !important;
}
.description {
  border: 0.0625rem solid #dfdfdf;
  position: relative;
  background-color: white;

  .description-header {
    height: 1.5rem;
    white-space: nowrap;
  }

  .description-content {
    height: 100%;
    position: relative;
  }

  .description-magition-options {
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    padding: 0.5rem 1rem;
    position: absolute;
    top: 2.25rem;
    z-index: 2;
    box-shadow: 0rem 0.25rem 0.25rem rgba(0, 0, 0, 0.25);
    border-radius: 0.25rem;
    width: 15rem;
    // height: 7.5rem;
    height: max-content;
    background-color: white;
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

.description-editor-wrapper {
  min-height: 7.75rem;
}
.desciption-example-add-btn {
  border-radius: 0.5rem;
  height: 3.5rem;
  width: 100%;
  cursor: pointer;
  &:hover {
    background-color: #dfdfdf;
  }
}
.description-box {
  width: 100%;
  height: calc(100% - 34.375rem);
  padding: 0.625rem 0.75rem;
  border-radius: 0.25rem;
  overflow: overlay;
}
.element-example-tooltip {
}
input {
  &:focus {
    outline: none;
  }
}
.idiom-insertion-modal-body {
  width: 60rem;
  height: 37.5rem;
  overflow: hidden;
}

.idiom-insertion-modal-searchbar {
  position: relative;
  width: 15rem;
  height: 2.5rem;
}
.idiom-insertion-modal-contents {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  height: 35rem;
  overflow-x: hidden;
  overflow-y: auto;
  .idiom-insertion-modal-card,
  .frequently-idiom-card {
    justify-content: space-between;
    border-radius: 0.25rem;
    padding: 0.625rem 0.5rem 0.625rem 0.75rem;
    color: black;
    font-weight: 400;
    white-space: normal;
    word-break: break-all;
  }
}

.element-table {
  height: calc(100% - 7.5rem);
  overflow: hidden;
  z-index: 1;

  .element-table-head {
    background: #eeeeee;

    .th {
      padding: 0.5rem;

      // border: 0.0625rem solid #dfdfdf;
      background: #eeeeee;

      font-size: 0.875rem;
      font-weight: bold;
      color: #616161;
      white-space: nowrap;
    }
  }

  .element-table-body {
    overflow: overlay;
    border-top: none;
    width: 100%;
    height: calc(100% - 2rem + 0.0625rem);

    .tr {
      background-color: white;
      line-height: 0.875rem;
      word-break: break-all;
      width: 100%;

      .td {
        overflow: overlay;
        div {
          padding-top: 0.125rem;
          width: calc(100% - 1rem);
        }
      }
      .td:nth-of-type(1) {
        width: 75%;
        padding-left: 0 !important;
      }
      .td:nth-of-type(2) {
        width: 25%;
      }
    }
    .tr:last-child {
      // border-bottom: 0 !important;
    }
  }
}
.element-description-editor-tooltip-first,
.element-description-editor-tooltip {
  z-index: 3;
  padding: 0.5rem;
  position: absolute;
  left: 1.25rem;
  width: 18.75rem;
  max-width: 15rem;
  background-color: #444444;
  color: white;
  border-radius: 0.5rem;
}
.element-description-editor-tooltip {
  bottom: 1.25rem;
}
.element-description-editor-contents {
  width: 48.5rem;
  height: 27.5625rem;
  background-color: #eeeeee;
  overflow: overlay;
}

.element-extract-modal-body {
  ::-webkit-scrollbar {
    width: 10px;
  }
}
</style>
