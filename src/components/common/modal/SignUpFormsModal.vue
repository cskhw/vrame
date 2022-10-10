<template>
  <div
    class="modal sign-up__email"
    v-bind:class="{ 'is-active': modalStore.signUpFormsModal.isOpen }"
  >
    <div class="modal-background"></div>
    <div
      class="modal-content"
      :style="{
        width: appStore.isMobile ? mobileWidth + 40 + 'px' : '',
        overflow: appStore.isMobile ? 'hidden' : '',
      }"
    >
      <div class="modal-header d-flex flex-column align-center">
        <button
          class="modal-close is-large"
          aria-label="close"
          @click="modalStore.signUpFormsModal.hide()"
        ></button>
        <div
          class="logo"
          style="margin-top: -1.375rem"
          :style="{ width: mobileWidth }"
        >
          <img
            :src="logo"
            alt="@/assets/images/draft.svg"
            :style="[
              {
                width: '12.5rem',
                height: 'auto',
                filter:
                  'invert(0%) sepia(87%) saturate(7459%) hue-rotate(172deg) brightness(0%) contrast(108%)',
              },
            ]"
          />
        </div>
        <p class="signup-title">
          {{ Util.getLocaleTxt(t, "common_signupTitle") }}
        </p>
      </div>
      <div class="modal-body">
        <div class="px-2" id="tab-content">
          <div id="product-details" class="content-data">
            <!-- Type of application -->
            <div class="services" :style="{ width: mobileWidth + 'px' }">
              <h3
                style="padding-bottom: 0.375rem"
                :style="{ width: mobileWidth + 'px' }"
              >
                {{ Util.getLocaleTxt(t, "signupform_format") }}
                <span>*</span>
              </h3>
              <p class="mb-2" :style="{ width: mobileWidth + 'px' }">
                {{ Util.getLocaleTxt(t, "signupform_formatDesc") }}
              </p>
            </div>
            <div
              class="navbar-item has-dropdown"
              :style="[
                activeTypeDropdown && { border: '0.0625rem solid #5C6BC0' },
                { width: mobileWidth ? mobileWidth + 'px' : '100%' },
              ]"
              v-on:click="activeTypeDropdown = !activeTypeDropdown"
              v-bind:class="{ 'is-active': activeTypeDropdown }"
            >
              <a
                class="navbar-link select-signupEmail"
                v-bind:class="{ 'selected-signupEmail': formData?.type !== '' }"
              >
                <p style="font-weight: 500">
                  {{ type }}
                </p>
              </a>
              <div
                id="selectFormat"
                class="navbar-dropdown"
                style="height: max-content; background: #fff; width: 100%"
                :style="[!activeTypeDropdown && { display: 'none' }]"
              >
                <a
                  class="navbar-item"
                  style="border: none; justify-content: center"
                  v-for="item in arrSelect"
                  :key="item"
                  v-on:click="selectType(item)"
                >
                  <p style="font-weight: 500">
                    {{ item }}
                  </p>
                </a>
              </div>
            </div>

            <div class="services" :style="{ width: mobileWidth + 'px' }">
              <h3 class="mb-2">
                {{ Util.getLocaleTxt(t, "signupform_basicInfo") }}<span>*</span>
              </h3>
            </div>
            <!-- name -->
            <div class="field" :style="{ width: mobileWidth + 'px' }">
              <div style="width: 100%; position: relative">
                <div class="omrs-input-group" style="position: relative">
                  <label class="omrs-input-filled">
                    <!-- 비정상 Submit 방지 -->
                    <input hidden />
                    <!-- 비정상 Submit 방지 -->
                    <input
                      required
                      class="input"
                      v-model="formData.name"
                      id="name-input"
                      autocomplete="off"
                      name="name-input"
                      :style="[
                        nameValidationCheckResult
                          ? { borderColor: '#f1f1f1' }
                          : { borderColor: '#d2416d' },
                      ]"
                      type="text"
                      @blur="checkInputValidity('name')"
                      @keydown="handleKeydown('name', $event)"
                    />
                    <span
                      class="omrs-input-label"
                      @click="placeholderClick('name')"
                      >{{ Util.getLocaleTxt(t, "signupform_name") }}</span
                    >
                  </label>
                </div>
                <div
                  v-if="!nameValidationCheckResult"
                  style="
                    margin: -0.375rem 0rem 0.625rem;
                    font-size: 0.75rem;
                    color: #d2416d;
                  "
                >
                  <span class="omrs-input-helper">{{
                    nameCheckResultMessage
                  }}</span>
                </div>
              </div>
            </div>

            <!-- email -->
            <div
              v-if="authStore.loginInfo.signupType === 'email'"
              class="field field-doubles"
              style="max-height: 4.6875rem"
              :style="{ width: mobileWidth + 'px' }"
            >
              <div style="width: 100%; position: relative">
                <div class="omrs-input-group" style="position: relative">
                  <label class="omrs-input-filled">
                    <!-- 비정상 Submit 방지 -->
                    <input hidden />
                    <!-- 비정상 Submit 방지 -->
                    <input
                      required
                      class="input"
                      v-model="formData.email"
                      id="email-input"
                      autocomplete="off"
                      name="email-input"
                      :disabled="emailDisabled"
                      :style="[
                        emailValidationCheckResult
                          ? { borderColor: '#f1f1f1' }
                          : { borderColor: '#d2416d' },
                      ]"
                      type="text"
                      @blur="checkInputValidity('email')"
                      @keydown="handleKeydown('email', $event)"
                    />
                    <span
                      class="omrs-input-label"
                      :class="{ disabled: emailDisabled }"
                      @click="placeholderClick('email')"
                      >{{ emailPlaceholder }}</span
                    >
                  </label>
                  <div
                    style="
                      position: absolute;
                      top: 43%;
                      right: 0;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      transform: translate(-5%, -50%);
                    "
                  >
                    <button
                      v-if="!appStore.isMobile"
                      id="email-auth-button"
                      :disabled="emailDisabled"
                      :style="[
                        formData.email != '' && emailValidationCheckResult
                          ? {
                              background: '#5C6BC0',
                              color: '#fff',
                            }
                          : { background: 'gray', cursor: 'not-allowed' },
                      ]"
                      style="font-size: 0.875rem"
                      class="button"
                      @click="emailBtnClick"
                    >
                      {{ emailBtnText }}
                    </button>
                  </div>
                </div>
                <div
                  v-if="!emailValidationCheckResult"
                  style="
                    margin: -0.375rem 0rem 0.625rem;
                    font-size: 0.75rem;
                    color: #d2416d;
                  "
                >
                  <span class="omrs-input-helper">{{
                    emailCheckResultMessage
                  }}</span>
                </div>
              </div>
            </div>
            <button
              v-if="appStore.isMobile"
              class="button mb-2"
              id="email-auth-button"
              :disabled="emailDisabled"
              :style="[
                formData.email != '' && emailValidationCheckResult
                  ? {
                      width: mobileWidth + 'px',
                      background: '#5C6BC0',
                      color: '#fff',
                    }
                  : {
                      width: mobileWidth + 'px',
                      background: 'gray',
                      cursor: 'not-allowed',
                    },
              ]"
              style="font-size: 0.875rem"
              @click="emailBtnClick"
            >
              {{ emailBtnText }}
            </button>

            <!--verify email -->
            <div
              v-if="authStore.loginInfo.signupType === 'email'"
              class="field field-doubles"
              style="max-height: 4.6875rem"
              :style="{ width: mobileWidth + 'px' }"
            >
              <div style="width: 100%; position: relative">
                <div class="omrs-input-group" style="position: relative">
                  <label class="omrs-input-filled">
                    <!-- 비정상 Submit 방지 -->
                    <input hidden />
                    <!-- 비정상 Submit 방지 -->
                    <input
                      required
                      class="input"
                      v-model="formData.emailAuthCode"
                      id="email-authcode-input"
                      :disabled="emailAuthCodeDisabled"
                      autocomplete="off"
                      name="email-authcode-input"
                      :style="[
                        emailAuthCodeValidationCheckResult
                          ? { borderColor: '#f1f1f1' }
                          : { borderColor: '#d2416d' },
                      ]"
                      type="text"
                      @blur="checkInputValidity('emailAuthCode')"
                      @keydown="handleKeydown('emailAuthCode', $event)"
                    />
                    <span
                      class="omrs-input-label"
                      :class="{ disabled: emailDisabled }"
                      @click="placeholderClick('emailAuthCode')"
                      >{{ emailAuthCodePlaceholder }}</span
                    >
                  </label>
                  <div
                    style="
                      position: absolute;
                      top: 43%;
                      right: 0;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      transform: translate(-5%, -50%);
                    "
                  >
                    <button
                      v-if="!appStore.isMobile"
                      id="email-auth-button"
                      :disabled="emailAuthCodeDisabled"
                      :style="[
                        formData.emailAuthCode != '' &&
                        emailAuthCodeValidationCheckResult
                          ? {
                              background: '#5C6BC0',
                              color: '#fff',
                            }
                          : { background: 'gray', cursor: 'not-allowed' },
                      ]"
                      style="font-size: 0.875rem"
                      class="button"
                      @click="emailAuthCodeBtnClick"
                    >
                      {{ emailAuthCodeBtnText }}
                    </button>
                  </div>
                </div>
                <div
                  v-if="!emailAuthCodeValidationCheckResult"
                  style="
                    margin: -0.375rem 0rem 0.625rem;
                    font-size: 0.75rem;
                    color: #d2416d;
                  "
                >
                  <span class="omrs-input-helper">{{
                    emailAuthCodeCheckResultMessage
                  }}</span>
                </div>
                <div
                  v-if="showEmailAuthTimer"
                  style="
                    margin: -0.375rem 0rem 0.625rem;
                    font-size: 0.75rem;
                    color: #5c6bc0;
                  "
                >
                  <span class="omrs-input-helper ml-3 mb-4"
                    >{{ Util.getLocaleTxt(t, "common_remainCount") }}:
                    <span style="color: #d2416d; font-weight: bold"
                      >{{ 5 - emailAuthCodeCheckTryCount
                      }}{{ Util.getLocaleTxt(t, "common_count") }}</span
                    >. {{ Util.getLocaleTxt(t, "common_remainTime") }}
                    <vue-countdown
                      :time="timer"
                      :style="{ color: '#D2416D', fontWeight: 'bold' }"
                      v-slot="{ minutes, seconds }"
                      @end="resetEmailAuthCode"
                      >{{ minutes }}:{{ seconds }}</vue-countdown
                    ></span
                  >
                </div>
              </div>
            </div>
            <button
              v-if="appStore.isMobile"
              class="button mb-2"
              id="email-auth-button"
              :disabled="emailAuthCodeDisabled"
              :style="[
                { width: mobileWidth + 'px' },
                formData.emailAuthCode != '' &&
                emailAuthCodeValidationCheckResult
                  ? {
                      background: '#5C6BC0',
                      color: '#fff',
                    }
                  : {
                      background: 'gray',
                      cursor: 'not-allowed',
                    },
                { width: appStore.isMobile ? mobileWidth + 'px' : '100%' },
              ]"
              style="font-size: 0.875rem"
              @click="emailAuthCodeBtnClick"
            >
              {{ emailAuthCodeBtnText }}
            </button>

            <!-- password -->
            <div
              v-if="authStore.loginInfo.signupType === 'email'"
              class="field"
            >
              <div
                class="field"
                style="max-height: 4.6875rem"
                :style="{ width: mobileWidth + 'px' }"
              >
                <div style="width: 100%; position: relative">
                  <div class="omrs-input-group" style="position: relative">
                    <label class="omrs-input-filled">
                      <!-- 비정상 Submit 방지 -->
                      <input hidden />
                      <!-- 비정상 Submit 방지 -->
                      <input
                        required
                        class="input"
                        v-model="formData.password"
                        id="password-input"
                        autocomplete="off"
                        name="password-input"
                        :style="[
                          passwordValidationCheckResult
                            ? { borderColor: '#f1f1f1' }
                            : { borderColor: '#d2416d' },
                        ]"
                        type="password"
                        @blur="checkInputValidity('password')"
                        @keydown="handleKeydown('password', $event)"
                      />
                      <span
                        class="omrs-input-label"
                        @click="placeholderClick('password')"
                        >{{
                          Util.getLocaleTxt(t, "signupform_passwordPlaceholder")
                        }}</span
                      >
                    </label>
                  </div>
                  <div
                    v-if="!passwordValidationCheckResult"
                    style="
                      margin: -0.375rem 0rem 0.625rem;
                      font-size: 0.75rem;
                      color: #d2416d;
                    "
                  >
                    <span class="omrs-input-helper">{{
                      passwordCheckResultMessage
                    }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- password confirm-->
            <div
              v-if="authStore.loginInfo.signupType === 'email'"
              class="field"
            >
              <div
                class="field"
                style="max-height: 4.6875rem"
                :style="{ width: mobileWidth + 'px' }"
              >
                <div style="width: 100%; position: relative">
                  <div class="omrs-input-group" style="position: relative">
                    <label class="omrs-input-filled">
                      <!-- 비정상 Submit 방지 -->
                      <input hidden />
                      <!-- 비정상 Submit 방지 -->
                      <input
                        required
                        class="input"
                        v-model="formData.passwordConfirm"
                        id="password-confirm-input"
                        autocomplete="off"
                        name="password-confirm-input"
                        :style="[
                          passwordConfirmValidationCheckResult
                            ? { borderColor: '#f1f1f1' }
                            : { borderColor: '#d2416d' },
                        ]"
                        type="password"
                        @blur="checkInputValidity('passwordConfirm')"
                        @keydown="handleKeydown('passwordConfirm', $event)"
                      />
                      <span
                        class="omrs-input-label"
                        @click="placeholderClick('passwordConfirm')"
                        >{{
                          Util.getLocaleTxt(
                            t,
                            "signupform_passwordConfirmPlaceholder"
                          )
                        }}</span
                      >
                    </label>
                  </div>
                  <div
                    v-if="!passwordConfirmValidationCheckResult"
                    style="
                      margin: -0.375rem 0rem 0.625rem;
                      font-size: 0.75rem;
                      color: #d2416d;
                    "
                  >
                    <span class="omrs-input-helper">{{
                      passwordConfirmCheckResultMessage
                    }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 휴대폰 인증 -->
            <div
              class="services"
              :class="{ 'mt-4': appStore.isMobile }"
              style="margin-top: -0.5rem"
            >
              <h3 class="mb-2">
                {{ Util.getLocaleTxt(t, "signupform_phoneValidation") }}
                <span>*</span>
              </h3>
            </div>
            <!-- Select country -->
            <div class="select-country" :style="{ width: mobileWidth + 'px' }">
              <div
                class="navbar-item has-dropdown field select-country__mobile"
                :style="[
                  activeCountryDropdown && {
                    border: '0.0625rem solid #5C6BC0',
                  },
                ]"
                v-on:click="activeCountryDropdown = !activeCountryDropdown"
                v-bind:class="{ 'is-active': activeCountryDropdown }"
              >
                <a
                  class="navbar-link select__cout d-flex align-center"
                  v-bind:class="{ selected__cout: country !== '' }"
                  :style="[
                    country === ''
                      ? { color: '#7C7F90', paddingLeft: '0.625rem' }
                      : { color: '#212037' },
                  ]"
                >
                  <img
                    style="
                      width: 1.25rem;
                      height: 0.9375rem;
                      margin-right: 0.3125rem;
                    "
                    v-bind:style="[
                      country === ''
                        ? { display: 'none' }
                        : { display: 'block' },
                    ]"
                    :src="country?.img"
                  />
                  {{
                    country === ""
                      ? Util.getLocaleTxt(t, "common_selectCountry")
                      : country?.dial_code
                  }}
                </a>
                <div
                  class="navbar-dropdown"
                  style="background: #fff; width: 18.75rem; height: 18.75rem"
                  :style="[!activeCountryDropdown && { display: 'none' }]"
                >
                  <a
                    class="navbar-item item__country"
                    v-for="item in countries"
                    :key="item.code"
                    v-on:click="selectCountry(item)"
                  >
                    <img :src="item.img" />
                    <span class="nameCountry">{{ item.name }}</span>
                    <span class="dial_code">{{ item.dial_code }}</span>
                  </a>
                </div>
              </div>

              <!-- Phone -->
              <div class="field field-doubles">
                <div style="width: 100%; position: relative">
                  <div class="omrs-input-group" style="position: relative">
                    <label class="omrs-input-filled">
                      <!-- 비정상 Submit 방지 -->
                      <input hidden />
                      <!-- 비정상 Submit 방지 -->
                      <input
                        required
                        class="input"
                        v-model="formData.phone"
                        id="phone-input"
                        autocomplete="off"
                        name="phone-input"
                        :disabled="phoneDisabled"
                        :style="[
                          phoneValidationCheckResult
                            ? { borderColor: '#f1f1f1' }
                            : { borderColor: '#d2416d' },
                        ]"
                        type="text"
                        @blur="checkInputValidity('phone')"
                        @keydown="handleKeydown('phone', $event)"
                      />
                      <span
                        class="omrs-input-label"
                        :class="{ disabled: phoneDisabled }"
                        @click="placeholderClick('phone')"
                        >{{ phonePlaceholder }}</span
                      >
                    </label>
                    <div
                      style="
                        position: absolute;
                        top: 43%;
                        right: 0;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transform: translate(-5%, -50%);
                      "
                    >
                      <button
                        v-if="!appStore.isMobile"
                        id="phone-auth-button"
                        :disabled="phoneDisabled"
                        :style="[
                          formData.phone != '' && phoneValidationCheckResult
                            ? {
                                background: '#5C6BC0',
                                color: '#fff',
                              }
                            : { background: 'gray', cursor: 'not-allowed' },
                        ]"
                        style="font-size: 0.875rem"
                        class="button"
                        @click="phoneBtnClick"
                      >
                        {{ phoneBtnText }}
                      </button>
                    </div>
                  </div>
                  <div
                    v-if="!phoneValidationCheckResult"
                    style="
                      margin: -0.375rem 0rem 0.625rem;
                      font-size: 0.75rem;
                      color: #d2416d;
                    "
                  >
                    <span class="omrs-input-helper">{{
                      phoneCheckResultMessage
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              v-if="appStore.isMobile"
              class="button mb-2"
              id="phone-auth-button"
              :disabled="phoneDisabled"
              :style="[
                formData.phone != '' && phoneValidationCheckResult
                  ? {
                      background: '#5C6BC0',
                      color: '#fff',
                    }
                  : { background: 'gray', cursor: 'not-allowed' },
                { width: appStore.isMobile ? mobileWidth + 'px' : '100%' },
              ]"
              style="font-size: 0.875rem"
              @click="phoneBtnClick"
            >
              {{ phoneBtnText }}
            </button>

            <!-- Phone Code-->
            <div class="field field-doubles">
              <div style="width: 100%; position: relative">
                <div class="omrs-input-group" style="position: relative">
                  <label class="omrs-input-filled">
                    <!-- 비정상 Submit 방지 -->
                    <input hidden />
                    <!-- 비정상 Submit 방지 -->
                    <input
                      required
                      class="input"
                      v-model="formData.phoneAuthCode"
                      id="phone-auth-button"
                      :disabled="phoneAuthCodeDisabled"
                      autocomplete="off"
                      name="phone-authcode-input"
                      :style="[
                        phoneAuthCodeValidationCheckResult
                          ? { borderColor: '#f1f1f1' }
                          : { borderColor: '#d2416d' },
                        {
                          width: appStore.isMobile
                            ? mobileWidth + 'px'
                            : '100%',
                        },
                      ]"
                      type="text"
                      @blur="checkInputValidity('phoneAuthCode')"
                      @keydown="handleKeydown('phoneAuthCode', $event)"
                    />
                    <span
                      class="omrs-input-label"
                      :class="{ disabled: phoneDisabled }"
                      @click="placeholderClick('phoneAuthCode')"
                      >{{ phoneAuthCodePlaceholder }}</span
                    >
                  </label>
                  <div
                    style="
                      position: absolute;
                      top: 43%;
                      right: 0;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      transform: translate(-5%, -50%);
                    "
                  >
                    <button
                      v-if="!appStore.isMobile"
                      id="phone-auth-code-button"
                      :disabled="phoneAuthCodeDisabled"
                      :style="[
                        formData.phoneAuthCode != '' &&
                        phoneAuthCodeValidationCheckResult
                          ? {
                              background: '#5C6BC0',
                              color: '#fff',
                            }
                          : { background: 'gray', cursor: 'not-allowed' },
                      ]"
                      style="font-size: 0.875rem"
                      class="button"
                      @click="phoneAuthCodeBtnClick"
                    >
                      {{ phoneAuthCodeBtnText }}
                    </button>
                  </div>
                </div>
                <div
                  v-if="!phoneAuthCodeValidationCheckResult"
                  style="
                    margin: -0.375rem 0rem 0.625rem;
                    font-size: 0.75rem;
                    color: #d2416d;
                  "
                >
                  <span class="omrs-input-helper">{{
                    phoneAuthCodeCheckResultMessage
                  }}</span>
                </div>
                <div
                  v-if="showPhoneAuthTimer"
                  style="
                    margin: -0.375rem 0rem 0.625rem;
                    font-size: 0.75rem;
                    color: #5c6bc0;
                  "
                >
                  <span class="omrs-input-helper ml-3 mb-4"
                    >{{ Util.getLocaleTxt(t, "common_remainCount") }}:
                    <span style="color: #d2416d; font-weight: bold"
                      >{{ 5 - phoneAuthCodeCheckTryCount
                      }}{{ Util.getLocaleTxt(t, "common_count") }}</span
                    >. {{ Util.getLocaleTxt(t, "common_remainTime") }}
                    <vue-countdown
                      :time="timer"
                      :style="{ color: '#D2416D', fontWeight: 'bold' }"
                      v-slot="{ minutes, seconds }"
                      @end="resetPhoneAuthCode"
                      >{{ minutes }}:{{ seconds }}</vue-countdown
                    ></span
                  >
                </div>
              </div>
            </div>

            <button
              v-if="appStore.isMobile"
              id="phone-auth-button"
              :disabled="phoneAuthCodeDisabled"
              :style="[
                formData.phoneAuthCode != '' &&
                phoneAuthCodeValidationCheckResult
                  ? {
                      background: '#5C6BC0',
                      color: '#fff',
                    }
                  : { background: 'gray', cursor: 'not-allowed' },
                { width: appStore.isMobile ? mobileWidth + 'px' : '100%' },
              ]"
              style="font-size: 0.875rem"
              class="button"
              @click="phoneAuthCodeBtnClick"
            >
              {{ phoneAuthCodeBtnText }}
            </button>

            <!-- Timezone -->
            <div
              id="timezone"
              class="services"
              :style="{ width: mobileWidth + 'px' }"
            >
              <h3 class="mb-2">
                {{ Util.getLocaleTxt(t, "signupform_timezone") }} <span>*</span>
              </h3>
              <p style="margin-bottom: 0.375rem">
                {{ Util.getLocaleTxt(t, "signupform_timezoneDesc") }}<br />
              </p>
            </div>
            <div
              class="navbar-item has-dropdown"
              :style="[
                activeTimezoneDropdown && { border: '0.0625rem solid #5C6BC0' },
                { width: appStore.isMobile ? mobileWidth + 'px' : '100%' },
              ]"
              v-on:click="activeTimezoneDropdown = !activeTimezoneDropdown"
              v-bind:class="{ 'is-active': activeTimezoneDropdown }"
            >
              <a
                class="navbar-link select-signupEmail"
                v-bind:class="{
                  'selected-signupEmail': formData?.timezone !== '',
                }"
              >
                <p style="font-weight: 500">
                  {{ timezone }}
                </p>
              </a>
              <div
                id="selectFormat"
                class="navbar-dropdown"
                style="height: 8.75rem; background: #fff; width: 100%"
                :style="[!activeTimezoneDropdown && { display: 'none' }]"
              >
                <a
                  class="navbar-item"
                  style="border: none; justify-content: center"
                  v-for="item in arrTimezoneSelect"
                  :key="item"
                  v-on:click="selectTimezone(item)"
                >
                  <p style="font-weight: 500">
                    {{ item }}
                  </p>
                </a>
              </div>
            </div>

            <!-- Agree all -->
            <div class="services d-flex flex-row">
              <div>
                <h5 style="font-weight: bold">
                  {{ Util.getLocaleTxt(t, "signupform_consent") }}
                </h5>
              </div>
            </div>

            <!-- Agree all -->
            <div class="services d-flex align-start">
              <CheckBox
                class="mr-1"
                v-model="agreeAll"
                @click="checkClick('all')"
              />
              <div>
                <h3 :style="subtitleStyle" @click="checkClick('all')">
                  {{ Util.getLocaleTxt(t, "signupform_allAgree") }}
                </h3>
                <p :style="{ width: mobileWidth - 40 + 'px' }">
                  {{ Util.getLocaleTxt(t, "signupform_allAgreeDesc") }}
                </p>
              </div>
            </div>
            <hr />
            <!-- Terms -->
            <div class="services d-flex" :style="{ width: mobileWidth + 'px' }">
              <CheckBox
                class="mr-1"
                v-model="termsOK"
                @click="checkClick('terms')"
              />
              <h3
                class="mr-2"
                :style="[subtitleStyle, { flex: '1' }]"
                @click="checkClick('terms')"
              >
                {{ Util.getLocaleTxt(t, "signupform_agreeServiceTerms") }}
                <span>*</span>
              </h3>
              <div
                class="mt-1"
                style="
                  width: max-content;
                  text-align: right;
                  font-size: 0.875rem;
                  font-weight: bold;
                "
              >
                <a
                  @click="modalStore.termsModal.show"
                  style="font-weight: bold"
                  >{{ Util.getLocaleTxt(t, "signupform_showContent") }}</a
                >
              </div>
            </div>

            <!-- Privacy -->
            <div class="services d-flex" :style="{ width: mobileWidth + 'px' }">
              <CheckBox
                class="mr-1"
                v-model="privacyOK"
                @click="checkClick('privacy')"
              />

              <h3
                class="mr-2"
                :style="[subtitleStyle, { flex: '1' }]"
                @click="checkClick('privacy')"
              >
                {{ Util.getLocaleTxt(t, "signupform_agreePrivacyPolicy") }}
                <span>*</span>
              </h3>
              <div
                class="mt-1"
                style="
                  width: max-content;
                  text-align: right;
                  font-size: 0.875rem;
                  font-weight: bold;
                "
              >
                <a
                  @click="modalStore.privacyModal.show"
                  style="font-weight: bold; fehite-space: nowrap"
                  >{{ Util.getLocaleTxt(t, "signupform_showContent") }}</a
                >
              </div>
            </div>

            <!-- Maintenace -->
            <div
              class="services d-flex align-start"
              :style="{ width: mobileWidth + 'px' }"
            >
              <CheckBox
                class="mr-1 align-start"
                v-model="agreementSystemOK"
                @click="checkClick('system')"
              />
              <div class="d-flex flex-column" style="flex: 1">
                <h3 :style="subtitleStyle" @click="checkClick('system')">
                  {{ Util.getLocaleTxt(t, "signupform_agreeSystem") }}
                </h3>

                <p class="d-flex align-center">
                  {{ Util.getLocaleTxt(t, "signupform_agreeSystemDesc") }}
                  <template v-if="i18n.locale.value.includes('en')">
                    {{ Util.getLocaleTxt(t, "signupform_agreeDescReceive") }}
                    <CheckBox
                      class="mx-1"
                      v-model="agreementSystemEmailOK"
                      @click="checkClick('systemEmail')"
                    />
                    <a
                      class="signup-checkbox-label"
                      @click="checkClick('systemEmail')"
                      >{{ Util.getLocaleTxt(t, "common_email") }}</a
                    >{{ Util.getLocaleTxt(t, "common_and") }}
                    <CheckBox
                      class="mx-1"
                      v-model="agreementSystemSMSOK"
                      @click="checkClick('systemSMS')"
                    />
                    <a
                      class="signup-checkbox-label"
                      @click="checkClick('systemSMS')"
                      >{{ Util.getLocaleTxt(t, "signupform_sms") }}</a
                    >
                  </template>
                  <template v-else>
                    <CheckBox
                      class="mx-1"
                      v-model="agreementSystemEmailOK"
                      @click="checkClick('systemEmail')"
                    />
                    <a
                      class="signup-checkbox-label"
                      @click="checkClick('systemEmail')"
                      >{{ Util.getLocaleTxt(t, "common_email") }}</a
                    >{{ Util.getLocaleTxt(t, "common_and") }}
                    <CheckBox
                      class="mx-1"
                      v-model="agreementSystemSMSOK"
                      @click="checkClick('systemSMS')"
                    />
                    <a
                      class="signup-checkbox-label"
                      @click="checkClick('systemSMS')"
                      >{{ Util.getLocaleTxt(t, "signupform_sms") }}</a
                    >{{ Util.getLocaleTxt(t, "signupform_agreeDescReceive") }}
                  </template>
                </p>
              </div>
            </div>

            <!-- News -->
            <div
              class="services d-flex align-start"
              :style="{ width: mobileWidth + 'px' }"
            >
              <CheckBox
                class="mr-1"
                v-model="agreementNewsOK"
                @click="checkClick('news')"
              />
              <div>
                <h3 :style="subtitleStyle" @click="checkClick('news')">
                  {{ Util.getLocaleTxt(t, "signupform_agreeNews") }}
                </h3>
                <p class="d-flex align-center">
                  {{ Util.getLocaleTxt(t, "signupform_agreeNewsDesc") }}
                  <template v-if="i18n.locale.value.includes('en')">
                    {{ Util.getLocaleTxt(t, "signupform_agreeDescReceive") }}
                    <CheckBox
                      class="mx-1"
                      v-model="agreementSystemEmailOK"
                      @click="checkClick('newsEmail')"
                    />
                    <a
                      class="signup-checkbox-label"
                      @click="checkClick('newsEmail')"
                      >{{ Util.getLocaleTxt(t, "common_email") }}</a
                    >{{ Util.getLocaleTxt(t, "common_and") }}
                    <CheckBox
                      class="mx-1"
                      v-model="agreementSystemSMSOK"
                      @click="checkClick('systemSMS')"
                    />
                    <a
                      class="signup-checkbox-label"
                      @click="checkClick('systemSMS')"
                      >{{ Util.getLocaleTxt(t, "signupform_sms") }}</a
                    >
                  </template>
                  <template v-else>
                    <CheckBox
                      class="mx-1"
                      v-model="agreementNewsEmailOK"
                      @click="checkClick('newsEmail')"
                    />
                    <a
                      class="signup-checkbox-label"
                      @click="checkClick('newsEmail')"
                      >{{ Util.getLocaleTxt(t, "common_email") }}</a
                    >{{ Util.getLocaleTxt(t, "common_and") }}
                    <CheckBox
                      class="mr-1"
                      v-model="agreementNewsSMSOK"
                      @click="checkClick('newsSMS')"
                    />
                    <a
                      class="signup-checkbox-label"
                      @click="checkClick('newsSMS')"
                      >{{ Util.getLocaleTxt(t, "signupform_sms") }}</a
                    >{{ Util.getLocaleTxt(t, "signupform_agreeDescReceive") }}
                  </template>
                </p>
              </div>
            </div>

            <!-- Education -->
            <div class="services d-flex align-start">
              <CheckBox
                class="mr-1"
                v-model="agreementEducationOK"
                @click="checkClick('education')"
              />
              <div :style="{ width: mobileWidth + 'px' }">
                <h3 :style="subtitleStyle" @click="checkClick('education')">
                  {{ Util.getLocaleTxt(t, "signupform_agreeEducation") }}
                </h3>
                <p class="d-flex align-center">
                  {{ Util.getLocaleTxt(t, "signupform_agreeEducationDesc") }}
                  <template v-if="i18n.locale.value.includes('en')">
                    {{ Util.getLocaleTxt(t, "signupform_agreeDescReceive") }}
                    <CheckBox
                      class="mx-1"
                      v-model="agreementSystemEmailOK"
                      @click="checkClick('educationEmail')"
                    />
                    <a
                      class="signup-checkbox-label"
                      @click="checkClick('educationEmail')"
                      >{{ Util.getLocaleTxt(t, "common_email") }}</a
                    >{{ Util.getLocaleTxt(t, "common_and") }}
                    <CheckBox
                      class="mx-1"
                      v-model="agreementSystemSMSOK"
                      @click="checkClick('educationSMS')"
                    />
                    <a
                      class="signup-checkbox-label"
                      @click="checkClick('educationSMS')"
                      >{{ Util.getLocaleTxt(t, "signupform_sms") }}</a
                    >
                  </template>
                  <template v-else>
                    <CheckBox
                      class="mx-1"
                      v-model="agreementEducationEmailOK"
                      @click="checkClick('educationEmail')"
                    />

                    <a
                      class="signup-checkbox-label"
                      @click="checkClick('educationEmail')"
                      >{{ Util.getLocaleTxt(t, "common_email") }}</a
                    >{{ Util.getLocaleTxt(t, "common_and") }}

                    <CheckBox
                      class="mx-1"
                      v-model="agreementEducationSMSOK"
                      @click="checkClick('educationSMS')"
                    />

                    <a
                      class="signup-checkbox-label"
                      @click="checkClick('educationSMS')"
                      >{{ Util.getLocaleTxt(t, "signupform_sms") }}</a
                    >{{ Util.getLocaleTxt(t, "signupform_agreeDescReceive") }}
                  </template>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <!-- button submit -->
        <div class="field is-grouped" style="">
          <div class="control btn-submit">
            <button
              @click="checkValidationAndRegist"
              class="button is-link"
              type="submit"
              :disabled="submitDisabled"
              style="background: #5c6bc0 !important; color: #fff !important"
            >
              {{ Util.getLocaleTxt(t, "common_signUp") }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <template v-if="isLoading">
      <div
        class="modal-content d-flex align-center justify-center"
        style="
          position: absolute;
          width: 39.75rem;
          height: 100%;
          background: transparent;
        "
      >
        <v-progress-circular
          indeterminate
          color="#5c6bc0"
          width="7"
          :size="50"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import api from "@/api/api";
import { extractError } from "@/api/error";
import type { JoinFormType } from "@/api/schema/request";
import Logo from "@/assets/images/draft.svg";
import { Country, type CountryType } from "@/assets/javascripts/country";
import * as Util from "@/assets/javascripts/ipedit_util";
import { asyncDebounce } from "@/assets/javascripts/utils/asyncDebounce";
import CheckBox from "@/components/common/CheckBox.vue";
import useAppStore from "@/store/useAppStore";
import useAuthStore from "@/store/useAuthStore";
import useModalStore from "@/store/useModalStore";
import VueCountdown from "@chenfengyuan/vue-countdown";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { timezoneData } from "@/assets/javascripts/data";
import type { AxiosError } from "axios";
import { SERVICE_CODE_PATH_DR } from "@/assets/javascripts/common";

const i18n = useI18n();
const { t } = useI18n();

const modalStore = useModalStore();
const appStore = useAppStore();
const authStore = useAuthStore();

const stores = {
  ms: modalStore,
  as: appStore,
};

const subtitleStyle = {
  cursor: "pointer",
  lineHeight: "1.75rem",
};

const mobileWidth = appStore.isMobile ? 300 : "";

const countries = ref<CountryType[]>(Country);

// 로딩바
const isLoading = ref(false);

const country = ref<any>("");

// 언어 설정에 따라서 셀렉트 순서 변경
const arrSelect = ref(
  appStore.lang === "KO"
    ? ["KIPO", "USPTO", "JPO", "EPO"]
    : appStore.lang === "JA"
    ? ["JPO", "USPTO", "KIPO", "EPO"]
    : ["USPTO", "EPO", "JPO", "KIPO"]
);

const arrTimezoneSelect = ref([...timezoneData]);
const activeTypeDropdown = ref(false);
const activeTimezoneDropdown = ref(false);
const activeCountryDropdown = ref(false);
const type = ref(Util.getLocaleTxt(t, "signupform_formatSelect"));
const timezone = ref(Util.getLocaleTxt(t, "signupform_timezone"));

const emailPlaceholder = ref(Util.getLocaleTxt(t, "common_email"));
const emailBtnText = ref(Util.getLocaleTxt(t, "common_requestCode"));
const emailDisabled = ref(true);

const emailAuthCodePlaceholder = ref(
  Util.getLocaleTxt(t, "common_inputAuthCode")
);
const emailAuthCodeBtnText = ref(Util.getLocaleTxt(t, "common_requestAuth"));
const emailAuthCodeDisabled = ref(true);

const phonePlaceholder = ref(Util.getLocaleTxt(t, "common_phonePlaceholder"));
const phoneBtnText = ref(Util.getLocaleTxt(t, "common_requestCode"));
const phoneDisabled = ref(false);

const phoneAuthCodePlaceholder = ref(
  Util.getLocaleTxt(t, "common_inputAuthCode")
);
const phoneAuthCodeBtnText = ref(Util.getLocaleTxt(t, "common_requestAuth"));
const phoneAuthCodeDisabled = ref(true);

const timer = ref(0);

const agreeAll = ref(false);
const termsOK = ref(false);
const privacyOK = ref(false);
const agreementSystemOK = ref(false);
const agreementSystemEmailOK = ref(false);
const agreementSystemSMSOK = ref(false);
const agreementNewsOK = ref(false);
const agreementNewsEmailOK = ref(false);
const agreementNewsSMSOK = ref(false);
const agreementEducationOK = ref(false);
const agreementEducationEmailOK = ref(false);
const agreementEducationSMSOK = ref(false);

const submitDisabled = ref(true);

const logo = ref(Logo);

interface SignUpFormType {
  country: { code: string };
  type: string;
  name: string;
  email: string;
  emailAuthCode: string;
  isEmailAuthorized: boolean;
  password: string;
  passwordConfirm: string;
  phone: string;
  phoneAuthCode: string;
  isPhoneAuthorized: boolean;
  timezone: string;
  termsOK: boolean;
  privacyOK: boolean;
  systemEmail: boolean;
  systemSMS: boolean;
  newsEmail: boolean;
  newsSMS: boolean;
  educationEmail: boolean;
  educationSMS: boolean;
}

const formData = ref<SignUpFormType>({
  country: { code: "" },
  type: "",
  name: "",
  email: "",
  emailAuthCode: "",
  isEmailAuthorized: false,
  password: "",
  passwordConfirm: "",
  phone: "",
  phoneAuthCode: "",
  isPhoneAuthorized: false,
  timezone: "",
  termsOK: false,
  privacyOK: false,
  systemEmail: true,
  systemSMS: true,
  newsEmail: true,
  newsSMS: true,
  educationEmail: true,
  educationSMS: true,
});

// 이름 유효성 체크 결과
const nameValidationCheckResult = ref(true);
// 이름 유효성 체크 결과 메시지
const nameCheckResultMessage = ref("");

// 이메일 유효성 체크 결과
const emailValidationCheckResult = ref(true);
// 이메일 유효성 체크 결과 메시지
const emailCheckResultMessage = ref("");

// 이메일 인증코드 유효성 체크 결과
const emailAuthCodeValidationCheckResult = ref(true);
// 이메일 유효성 체크 결과 메시지
const emailAuthCodeCheckResultMessage = ref("");
// 이메일 인증코드 입력 타이머 on/off
const showEmailAuthTimer = ref(false);
// 이메일 유효성 체크 신청 횟수(최대 5회)
const emailAuthCodeCheckTryCount = ref(0);

// 비밀번호 유효성 체크 결과
const passwordValidationCheckResult = ref(true);
// 비밀번호 유효성 체크 결과 메시지
const passwordCheckResultMessage = ref("");

// 비밀번호 재입력 유효성 체크 결과
const passwordConfirmValidationCheckResult = ref(true);
// 비밀번호 재입력 유효성 체크 결과 메시지
const passwordConfirmCheckResultMessage = ref("");

// 핸드폰 번호 유효성 체크 결과
const phoneValidationCheckResult = ref(true);
// 핸드폰 번호 유효성 체크 결과 메시지
const phoneCheckResultMessage = ref("");

// 핸드폰 번호 인증코드 유효성 체크 결과
const phoneAuthCodeValidationCheckResult = ref(true);
// 핸드폰 번호 유효성 체크 결과 메시지
const phoneAuthCodeCheckResultMessage = ref("");
// 핸드폰 번호 인증코드 입력 타이머 on/off
const showPhoneAuthTimer = ref(false);
// 핸드폰 번호 유효성 체크 신청 횟수(최대 5회)
const phoneAuthCodeCheckTryCount = ref(0);

console.log(showEmailAuthTimer.value);
watch(type, (newVal: string) => {
  if (
    (newVal === "USPTO" ||
      newVal === "EPO" ||
      newVal === "JPO" ||
      newVal === "KIPO") &&
    !showEmailAuthTimer.value
  ) {
    console.log(newVal);
    emailDisabled.value = false;
  }
});

function selectType(item: string) {
  type.value = item;
  formData.value.type = item;
}

function selectTimezone(item: string) {
  timezone.value = item;
  formData.value.timezone = item;
}

function selectCountry(item: CountryType | null) {
  // item null 처리
  if (item === null) {
    Util.openAlertModal(stores, "Country error!");
    return false;
  }
  // 나라 선택 div를 disabled하면 좋은데, 개발된 UI가 select가 아니어서 안됨
  // 임시 방편으로 나라 바꾸면 휴대폰 번호 리셋하고 다시 진행
  if (phoneAuthCodeDisabled.value == false) {
    formData.value.phone = "";
    resetPhoneAuthCode();
  }
  country.value = item;
  formData.value.country = item;

  console.log("item.timezone: ", item.timezone);

  // 선택된 나라에 맞춰서 시간대 자동으로 변경해 줌
  selectTimezone(item.timezone);
}

// 가입하기 버튼 활성화 제어
function checkSubmitStatus() {
  // console.log("바뀌었다");

  if (authStore.loginInfo.signupType == "email") {
    if (
      formData.value.type != "" &&
      formData.value.name != "" &&
      formData.value.isEmailAuthorized &&
      formData.value.password != "" &&
      formData.value.isPhoneAuthorized &&
      formData.value.timezone != "" &&
      formData.value.termsOK &&
      formData.value.privacyOK
    )
      submitDisabled.value = false;
    else submitDisabled.value = true;
  } else if (
    authStore.loginInfo.signupType == "google" ||
    authStore.loginInfo.signupType == "apple"
  ) {
    if (
      formData.value.name != "" &&
      formData.value.type != "" &&
      formData.value.isPhoneAuthorized &&
      formData.value.timezone != "" &&
      formData.value.termsOK &&
      formData.value.privacyOK
    )
      submitDisabled.value = false;
    else submitDisabled.value = true;
  } else submitDisabled.value = true;
}

// formData의 상태를 보고 가입하기 버튼 상태 변경
watch(formData.value, () => {
  checkSubmitStatus();
});

function openWelcomeModal() {
  // 회원가입 폼 모달 닫기
  modalStore.signUpFormsModal.hide();
  modalStore.infoModal.show();

  modalStore.infoModal.alert = false;
  modalStore.infoModal.title = "Welcome to IPEDIT!";
  modalStore.infoModal.desc = Util.getLocaleTxt(
    t,
    "signupform_congratulationsSignUp"
  );
  modalStore.infoModal.buttonType = "Y";
  modalStore.infoModal.yesButtonText = Util.getLocaleTxt(t, "common_login");
  modalStore.infoModal.yesButtonFunc = (e: any) => {
    modalStore.infoModal.hide();
    modalStore.loginModal.show(); // 로그인 모달로 유도
  };
  modalStore.infoModal.closeBtn = false;
}

// 이메일 인증 요청 버튼 클릭
function emailBtnClick() {
  // 이메일 유효성 체크 진행
  checkInputValidity("email");

  // 문제 있으면 리턴
  if (formData.value.email == "" || emailValidationCheckResult.value == false) {
    document.getElementById("email-input")?.focus();
    return;
  }

  asyncRequestEmailAuth();
}
// 이메일 인증요청 반복실행 방지용
const asyncRequestEmailAuth = asyncDebounce(requestEmailAuth);
// 이메일 인증요청
async function requestEmailAuth() {
  try {
    isLoading.value = true;

    await api.auth.requestEmailVerification(
      {
        service_code_path: SERVICE_CODE_PATH_DR,
        format_code_path: "FORMAT/" + formData.value.type,
      },
      {
        email: formData.value.email,
        verification_type: "sign_up_now",
      }
    );

    // 이메일 입력창 비활성화
    emailDisabled.value = true;
    // 인증코드 요청 버튼 텍스트 변경
    emailBtnText.value = Util.getLocaleTxt(t, "common_requestCodeAgain");
    // 인증코드 입력창 활성화
    emailAuthCodeDisabled.value = false;
    // 입력 타이머 셋팅 (다시 요청했을 때, 타이머가 리셋되지 않는데 라이브러리 문제인듯)
    timer.value = 300000;
    // 이메일 인증 시도횟수 초기화
    emailAuthCodeCheckTryCount.value = 0;
    // 인증코드 입력 타이머 표시
    showEmailAuthTimer.value = true;
    // 이메일 인증코드 입력창으로 포커스 이동
    document.getElementById("email-authcode-input")?.focus();

    Util.openInfoModal(stores, Util.getLocaleTxt(t, "common_codeSentToEmail"));
  } catch (e: AxiosError | Error | any) {
    const error = extractError(e);
    // appStore.isLoading = false;
    // invalidVerificationRequestError: 453 에러
    if (error.status === 453)
      Util.openAlertModal(
        stores,
        Util.getLocaleTxt(t, "signupform_alreadyJoinedEmail")
      );
    else Util.openAlertModal(stores, "server error");
  } finally {
    isLoading.value = false;
  }
}

// 이메일 인증코드 리셋
function resetEmailAuthCode() {
  // 이메일 체크가 완료된 상태이면 초기화하지 않고 그냥 나감(타이머 닫힐 때에도 @end 이벤트타고 실행되서 막아줌)
  if (formData.value.isEmailAuthorized == true) return;

  // 이메일 입력창 placeholder 초기화
  emailPlaceholder.value = Util.getLocaleTxt(t, "common_email");
  // 이메일 입력창 및 버튼 활성화
  emailDisabled.value = false;
  // 인증번호 초기화
  formData.value.emailAuthCode = "";
  // 인증 시도횟수 초기화
  emailAuthCodeCheckTryCount.value = 0;
  // 인증코드 입력창 비활성화
  emailAuthCodeDisabled.value = true;
  // 입력 타이머 셋팅
  timer.value = 0;
  // 인증코드 입력 타이머 표시
  showEmailAuthTimer.value = false;
  // 인증코드 입력창 텍스트 변경
  emailAuthCodePlaceholder.value = Util.getLocaleTxt(t, "common_inputAuthCode");
  // 이메일 입력창으로 포커스 이동
  document.getElementById("email-input")?.focus();
}

// 이메일 인증코드 인증요청 버튼 클릭
function emailAuthCodeBtnClick() {
  // 이메일 인증코드 유효성 체크 진행
  checkInputValidity("emailAuthCode");

  // 문제 있으면 리턴
  if (
    formData.value.emailAuthCode == "" ||
    emailAuthCodeValidationCheckResult.value == false
  ) {
    document.getElementById("email-authcode-input")?.focus();
    return;
  }

  // 인증코드 인증요청횟수 증가
  emailAuthCodeCheckTryCount.value = emailAuthCodeCheckTryCount.value + 1;

  asyncRequestEmailAuthCodeAuth();
}

// 이메일 인증코드 인증요청 반복실행 방지용
const asyncRequestEmailAuthCodeAuth = asyncDebounce(requestEmailAuthCodeAuth);

// 이메일 인증코드 인증요청
async function requestEmailAuthCodeAuth() {
  try {
    isLoading.value = true;

    if (formData.value.email !== undefined) {
      await api.auth.confirmEmailVerification({
        email: formData.value.email,
        auth_code: formData.value.emailAuthCode,
      });

      // 이메일 인증 결과 설정
      formData.value.isEmailAuthorized = true;

      // 이메일 인증코드 입력 비활성화
      emailBtnText.value = Util.getLocaleTxt(t, "common_authComplete");
      emailAuthCodeBtnText.value = Util.getLocaleTxt(t, "common_authComplete");
      emailAuthCodeDisabled.value = true;
      timer.value = 0;
      showEmailAuthTimer.value = false;

      Util.openInfoModal(
        stores,
        Util.getLocaleTxt(t, "common_completeEmailAuth")
      );
    }
  } catch (e) {
    const error = extractError(e);
    // appStore.isLoading = false;
    // invalidVerificationRequestError: 453 에러
    if (error.status === 453)
      Util.openAlertModal(stores, Util.getLocaleTxt(t, "common_wrongAuthCode"));
    else Util.openAlertModal(stores, error.status);

    // 최대 인증 요청 횟수 5번까지 인증이 안되었으면 이메일 인증코드 리셋하고, 인증코드 다시 받도록 유도
    if (emailAuthCodeCheckTryCount.value == 5) {
      resetEmailAuthCode();
      return;
    }
  } finally {
    isLoading.value = false;
  }
}

// 휴대폰 인증 요청 버튼 클릭
function phoneBtnClick() {
  // 휴대폰 유효성 체크 진행
  checkInputValidity("phone");

  if (formData.value.country.code.trim() == "") {
    activeCountryDropdown.value = true;
    return;
  }

  // 문제 있으면 리턴
  if (formData.value.phone == "" || phoneValidationCheckResult.value == false) {
    document.getElementById("phone-input")?.focus();
    return;
  }

  asyncRequestPhoneAuth();
}

// 휴대폰 인증요청 반복실행 방지용
const asyncRequestPhoneAuth = asyncDebounce(requestPhoneAuth);

// 휴대폰 인증요청
async function requestPhoneAuth() {
  console.log(formData.value.country.code.toUpperCase(), formData.value.phone);
  try {
    isLoading.value = true;

    await api.auth.requestPhoneNumberVerification({
      country_code: formData.value.country.code,
      phone_number: formData.value.phone,
      verification_type: "sign_up_now",
    });

    // 휴대폰 번호 입력창 비활성화
    phoneDisabled.value = true;
    // 인증코드 요청 버튼 텍스트 변경
    phoneBtnText.value = Util.getLocaleTxt(t, "common_requestCodeAgain");
    // 인증코드 입력창 활성화
    phoneAuthCodeDisabled.value = false;
    // 입력 타이머 셋팅 (다시 요청했을 때, 타이머가 리셋되지 않는데 라이브러리 문제인듯)
    timer.value = 300000;
    // 이메일 인증 시도횟수 초기화
    phoneAuthCodeCheckTryCount.value = 0;
    // 인증코드 입력 타이머 표시
    showPhoneAuthTimer.value = true;
    // 이메일 인증코드 입력창으로 포커스 이동
    document.getElementById("phone-authcode-input")?.focus();

    Util.openInfoModal(stores, Util.getLocaleTxt(t, "common_codeSentToPhone"));
  } catch (e: any) {
    const error = extractError(e);
    // appStore.isLoading = false;
    // invalidVerificationRequestError: 453 에러
    if (error.status === 453)
      Util.openAlertModal(
        stores,
        Util.getLocaleTxt(t, "signupform_alreadyJoinedPhone")
      );
    else Util.openAlertModal(stores, error.status);
  } finally {
    isLoading.value = false;
  }
}

// 휴대폰 인증코드 리셋
function resetPhoneAuthCode() {
  // 휴대폰 체크가 완료된 상태이면 초기화하지 않고 그냥 나감(타이머 닫힐 때에도 @end 이벤트타고 실행되서 막아줌)
  if (formData.value.isPhoneAuthorized == true) return;

  // 휴대폰 입력창 placeholder 초기화
  phonePlaceholder.value = Util.getLocaleTxt(t, "common_phonePlaceholder");
  // 휴대폰 입력창 및 버튼 활성화
  phoneDisabled.value = false;
  // 인증번호 초기화
  formData.value.phoneAuthCode = "";
  // 인증 시도횟수 초기화
  phoneAuthCodeCheckTryCount.value = 0;
  // 인증코드 입력창 비활성화
  phoneAuthCodeDisabled.value = true;
  // 입력 타이머 셋팅
  timer.value = 0;
  // 인증코드 입력 타이머 표시
  showPhoneAuthTimer.value = false;
  // 인증코드 입력창 텍스트 변경
  phoneAuthCodePlaceholder.value = Util.getLocaleTxt(t, "common_inputAuthCode");
  // 휴대폰 입력창으로 포커스 이동
  document.getElementById("phone-input")?.focus();
}

// 휴대폰 인증코드 인증요청 버튼 클릭
function phoneAuthCodeBtnClick() {
  // 휴대폰 인증코드 유효성 체크 진행
  checkInputValidity("phoneAuthCode");

  // 문제 있으면 리턴
  if (
    formData.value.phoneAuthCode == "" ||
    phoneAuthCodeValidationCheckResult.value == false
  ) {
    document.getElementById("phone-authcode-input")?.focus();
    return;
  }

  // 인증코드 인증요청횟수 증가
  phoneAuthCodeCheckTryCount.value = phoneAuthCodeCheckTryCount.value + 1;

  asyncRequestPhoneAuthCodeAuth();
}

// 휴대폰 인증코드 인증요청 반복실행 방지용
const asyncRequestPhoneAuthCodeAuth = asyncDebounce(requestPhoneAuthCodeAuth);

// 휴대폰 인증코드 인증요청
async function requestPhoneAuthCodeAuth() {
  try {
    isLoading.value = true;

    await api.auth.confirmPhoneNumVerification({
      country_code: formData.value.country.code,
      phone_number: formData.value.phone,
      auth_code: formData.value.phoneAuthCode,
    });

    // 휴대폰 인증 결과 설정
    formData.value.isPhoneAuthorized = true;

    // 휴대폰 인증코드 입력 비활성화
    phoneBtnText.value = Util.getLocaleTxt(t, "common_authComplete");
    phoneAuthCodeBtnText.value = Util.getLocaleTxt(t, "common_authComplete");
    phoneAuthCodeDisabled.value = true;
    timer.value = 0;
    showPhoneAuthTimer.value = false;

    document.getElementById("timezone").scrollIntoView();

    Util.openInfoModal(
      stores,
      Util.getLocaleTxt(t, "common_completePhoneAuth")
    );
  } catch (e) {
    const error = extractError(e);
    // appStore.isLoading = false;
    // invalidVerificationRequestError: 453 에러
    if (error.status === 453)
      Util.openAlertModal(stores, Util.getLocaleTxt(t, "common_wrongAuthCode"));
    else Util.openAlertModal(stores, error.status);

    // 최대 인증 요청 횟수 5번까지 인증이 안되었으면 휴대폰 인증코드 리셋하고, 인증코드 다시 받도록 유도
    if (phoneAuthCodeCheckTryCount.value == 5) {
      resetPhoneAuthCode();
      return;
    }
  } finally {
    isLoading.value = false;
  }
}

// 회원 가입 신청 전에 마지막으로 전체 유효성 점검
function checkValidationAndRegist() {
  // 가입하기 버튼 활성화 제어하는데에서 이미 유효성 체크가 다 되어 있음
  // 바로 가입요청합시다.
  asyncRegist();
}
// 가입하기 중복실행 방지
const asyncRegist = asyncDebounce(requestRegist);
// 가입하기 요청
async function requestRegist() {
  let userFormData: JoinFormType = {
    // 개인가입자는 CLIENT_TYPE/B2CXXX. 그룹가입자는 관리자가 따로 처리
    client_type_code_path: "CLIENT_TYPE/B2CXXX",
    detail: {
      theme_code_path: "THEME/BLUE",
      ui_lang_code_path: "UI_LANGUAGE/" + appStore.lang,
      name: formData.value.name,
      country_code: formData.value.country.code.toLocaleUpperCase(),
      phone_num: formData.value.phone,
      // timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezone: formData.value.timezone,
      join_type: authStore.loginInfo.signupType,
    },
    statuses: [
      {
        service_code_path: "SERVICE/DR",
        format_code_path: "FORMAT/" + formData.value.type,
      },
    ],
    acceptance: {
      sms_news_acceptance: formData.value.newsSMS,
      sms_system_acceptance: formData.value.systemSMS,
      sms_education_acceptance: formData.value.educationSMS,
      email_news_acceptance: formData.value.newsEmail,
      email_system_acceptance: formData.value.systemEmail,
      email_education_acceptance: formData.value.educationEmail,
    },
  };

  // console.log(userFormData);

  try {
    isLoading.value = true;

    const signupType = authStore.loginInfo.signupType;

    if (signupType === "email") {
      userFormData.user_email = formData.value.email!;
      userFormData.user_pwd = formData.value.password!;
      await api.join.email(userFormData);
    } else if (signupType === "google") {
      userFormData.token = authStore.loginInfo.token;
      await api.join.google(userFormData);
    } else if (signupType === "apple") {
      userFormData.token = authStore.loginInfo.token;
      await api.join.apple(userFormData);
    } else {
      Util.openAlertModal(stores, `Invalid access: ${signupType}`);
      return;
    }

    openWelcomeModal();
  } catch (e) {
    const error = extractError(e);
    Util.openAlertModal(stores, error.status);
  } finally {
    isLoading.value = false;
  }
}

// 각 입력창에서 키보드 이벤트 들어오는거 핸들링
function handleKeydown(target: string, e: KeyboardEvent) {
  // 입력창에서는 Esc 눌러도 안나감
  if (e.key == "Escape") {
    e.preventDefault();
    e.stopPropagation();
  }

  // 이름인 경우, 엔터치면 이메일 입력으로
  if (target == "name" && e.key == "Enter") {
    document.getElementById("email-input")?.focus();
  }

  // 이메일인 경우, 키입력 있으면 상태를 정상으로 바꿔줌. 엔터치면 blur시켜서 유효성 체크하게 동작
  if (target == "email") {
    emailValidationCheckResult.value = true;
    emailCheckResultMessage.value = "";
    if (e.key == "Enter") {
      document.getElementById("email-input")?.blur();
    }
  }

  // 이메일 인증코드인 경우, 키입력 있으면 상태를 정상으로 바꿔줌. 엔터치면 blur시켜서 유효성 체크하게 동작
  if (target == "emailAuthCode") {
    emailAuthCodeValidationCheckResult.value = true;
    emailAuthCodeCheckResultMessage.value = "";
    if (e.key == "Enter") {
      document.getElementById("email-authcode-input")?.blur();
    }
  }

  // 비밀번호인 경우, 키입력 있으면 상태를 정상으로 바꿔줌. 엔터치면 blur시켜서 유효성 체크하게 동작
  if (target == "password") {
    passwordValidationCheckResult.value = true;
    passwordCheckResultMessage.value = "";
    if (e.key == "Enter") {
      document.getElementById("password-confirm-input")?.focus();
    }
  }

  // 비밀번호재입력인 경우, 키입력 있으면 상태를 정상으로 바꿔줌. 엔터치면 blur시켜서 유효성 체크하게 동작
  if (target == "passwordConfirm") {
    passwordConfirmValidationCheckResult.value = true;
    passwordConfirmCheckResultMessage.value = "";
    if (e.key == "Enter") {
      document.getElementById("password-confirm-input")?.blur();
    }
  }

  // 휴대폰인 경우, 키입력 있으면 상태를 정상으로 바꿔줌. 엔터치면 blur시켜서 유효성 체크하게 동작
  if (target == "phone") {
    phoneValidationCheckResult.value = true;
    phoneCheckResultMessage.value = "";
    if (e.key == "Enter") {
      document.getElementById("phone-input")?.blur();
    }
  }

  // 휴대폰 인증코드인 경우, 키입력 있으면 상태를 정상으로 바꿔줌. 엔터치면 blur시켜서 유효성 체크하게 동작
  if (target == "phoneAuthCode") {
    phoneAuthCodeValidationCheckResult.value = true;
    phoneAuthCodeCheckResultMessage.value = "";
    if (e.key == "Enter") {
      document.getElementById("phone-authcode-input")?.blur();
    }
  }
}

// 인풋 유효성 체크
function checkInputValidity(target: string) {
  // console.log(props.validationType, modelValue.value);
  // 이름 유효성 체크
  if (target == "name" && formData.value.name.trim() != "") {
    // DB에서 varchar로 데이터타입 선언하면, 문자 종류에 상관없이 모두 1글자를 1byte로 처리함
    // name 필드는 varchar(45)인데, 안전하게 40까지만
    if (formData.value.name.trim().length > 40) {
      nameValidationCheckResult.value = false;
      nameCheckResultMessage.value = Util.getLocaleTxt(
        t,
        "signupform_nameLengthError"
      );
    }
  }

  // 이메일 유효성 체크
  if (target == "email" && formData.value.email.trim() != "") {
    let regExp =
      /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    if (!regExp.test(formData.value.email)) {
      emailValidationCheckResult.value = false;
      emailCheckResultMessage.value = Util.getLocaleTxt(
        t,
        "common_emailFormatError"
      );
    } else {
      emailValidationCheckResult.value = true;
      emailCheckResultMessage.value = "";
    }
  }

  // 이메일 인증코드 유효성 체크
  if (target == "emailAuthCode" && formData.value.emailAuthCode != "") {
    if (formData.value.emailAuthCode.length != 6) {
      emailAuthCodeValidationCheckResult.value = false;
      emailAuthCodeCheckResultMessage.value = Util.getLocaleTxt(
        t,
        "common_authCodeFormatError"
      );
    } else {
      emailAuthCodeValidationCheckResult.value = true;
      emailAuthCodeCheckResultMessage.value = "";
    }
  }

  // 비밀번호 유효성 체크
  if (target == "password" && formData.value.password.trim() != "") {
    let regExp =
      /^(?=.*[a-zA-Z])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])(?=.*[0-9]).{8,20}$/;
    if (!regExp.test(formData.value.password)) {
      passwordValidationCheckResult.value = false;
      passwordCheckResultMessage.value = Util.getLocaleTxt(
        t,
        "common_passwordFormatError"
      );
    } else {
      passwordValidationCheckResult.value = true;
      passwordCheckResultMessage.value = "";
    }
  }

  // 비밀번호 재입력 유효성 체크
  if (
    target == "passwordConfirm" &&
    formData.value.passwordConfirm.trim() != ""
  ) {
    let regExp =
      /^(?=.*[a-zA-Z])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])(?=.*[0-9]).{8,20}$/;
    if (!regExp.test(formData.value.passwordConfirm)) {
      passwordConfirmValidationCheckResult.value = false;
      passwordConfirmCheckResultMessage.value = Util.getLocaleTxt(
        t,
        "common_passwordFormatError"
      );
    } else if (formData.value.password != formData.value.passwordConfirm) {
      passwordConfirmValidationCheckResult.value = false;
      passwordConfirmCheckResultMessage.value = Util.getLocaleTxt(
        t,
        "signupform_passwordConfirmError"
      );
    } else {
      passwordConfirmValidationCheckResult.value = true;
      passwordConfirmCheckResultMessage.value = "";
    }
  }

  // 전화번호 인증코드 유효성 체크
  if (target == "phone" && formData.value.phone != "") {
    let regExp = /^[0-9]+$/;

    if (!regExp.test(formData.value.phone)) {
      phoneValidationCheckResult.value = false;
      phoneCheckResultMessage.value = Util.getLocaleTxt(
        t,
        "common_phoneFormatError"
      );
    } else if (
      formData.value.phone.length > 15 ||
      formData.value.phone.length < 8
    ) {
      phoneValidationCheckResult.value = false;
      phoneCheckResultMessage.value = Util.getLocaleTxt(
        t,
        "common_phoneLengthError"
      );
    } else {
      phoneValidationCheckResult.value = true;
      phoneCheckResultMessage.value = "";
    }
  }

  // 휴대폰 인증코드 유효성 체크
  if (target == "phoneAuthCode" && formData.value.phoneAuthCode != "") {
    if (formData.value.phoneAuthCode.length != 6) {
      phoneAuthCodeValidationCheckResult.value = false;
      phoneAuthCodeCheckResultMessage.value = Util.getLocaleTxt(
        t,
        "common_authCodeFormatError"
      );
    } else {
      phoneAuthCodeValidationCheckResult.value = true;
      phoneAuthCodeCheckResultMessage.value = "";
    }
  }
}
// 코드에 따라 국가 설정해 줌
function getCountryItem(code: string): CountryType | null {
  let selectedCountry: CountryType | null = null;
  countries.value.forEach((item: CountryType) => {
    if (item.code.toUpperCase() == code) selectedCountry = item;
  });
  return selectedCountry;
}

// UI상 placeholder 위치가 커서, placeholder 누르면 입력창으로 이동시켜 줌
function placeholderClick(target: string) {
  if (target == "name") {
    document.getElementById("name-input")?.focus();
  }

  if (target == "email") {
    document.getElementById("email-input")?.focus();
  }

  if (target == "emailAuthCode") {
    document.getElementById("email-authcode-input")?.focus();
  }

  if (target == "password") {
    document.getElementById("password-input")?.focus();
  }

  if (target == "passwordConfirm") {
    document.getElementById("password-confirm-input")?.focus();
  }

  if (target == "phone") {
    document.getElementById("phone-input")?.focus();
  }

  if (target == "phoneAuthCode") {
    document.getElementById("phone-authcode-input")?.focus();
  }
}

function checkClick(type: string) {
  if (type == "all") {
    termsOK.value = !agreeAll.value;
    privacyOK.value = !agreeAll.value;
    agreementSystemOK.value = !agreeAll.value;
    agreementSystemEmailOK.value = !agreeAll.value;
    agreementSystemSMSOK.value = !agreeAll.value;
    agreementNewsOK.value = !agreeAll.value;
    agreementNewsEmailOK.value = !agreeAll.value;
    agreementNewsSMSOK.value = !agreeAll.value;
    agreementEducationOK.value = !agreeAll.value;
    agreementEducationEmailOK.value = !agreeAll.value;
    agreementEducationSMSOK.value = !agreeAll.value;
    agreeAll.value = !agreeAll.value;
  }

  if (type == "terms") {
    termsOK.value = !termsOK.value;
  }

  if (type == "privacy") {
    privacyOK.value = !privacyOK.value;
  }

  if (type == "system") {
    agreementSystemEmailOK.value = !agreementSystemOK.value;
    agreementSystemSMSOK.value = !agreementSystemOK.value;
    agreementSystemOK.value = !agreementSystemOK.value;
  }

  if (type == "news") {
    agreementNewsEmailOK.value = !agreementNewsOK.value;
    agreementNewsSMSOK.value = !agreementNewsOK.value;
    agreementNewsOK.value = !agreementNewsOK.value;
  }

  if (type == "education") {
    agreementEducationEmailOK.value = !agreementEducationOK.value;
    agreementEducationSMSOK.value = !agreementEducationOK.value;
    agreementEducationOK.value = !agreementEducationOK.value;
  }

  if (type == "systemEmail")
    agreementSystemEmailOK.value = !agreementSystemEmailOK.value;

  if (type == "systemSMS")
    agreementSystemSMSOK.value = !agreementSystemSMSOK.value;

  if (agreementSystemEmailOK.value && agreementSystemSMSOK.value)
    agreementSystemOK.value = true;
  else if (!agreementSystemEmailOK.value && !agreementSystemSMSOK.value)
    agreementSystemOK.value = false;

  if (type == "newsEmail")
    agreementNewsEmailOK.value = !agreementNewsEmailOK.value;

  if (type == "newsSMS") agreementNewsSMSOK.value = !agreementNewsSMSOK.value;

  if (agreementNewsEmailOK.value && agreementNewsSMSOK.value)
    agreementNewsOK.value = true;
  else if (!agreementNewsEmailOK.value && !agreementNewsSMSOK.value)
    agreementNewsOK.value = false;

  if (type == "educationEmail")
    agreementEducationEmailOK.value = !agreementEducationEmailOK.value;

  if (type == "educationSMS")
    agreementEducationSMSOK.value = !agreementEducationSMSOK.value;

  if (agreementEducationEmailOK.value && agreementEducationSMSOK.value)
    agreementEducationOK.value = true;
  else if (!agreementEducationEmailOK.value && !agreementEducationSMSOK.value)
    agreementEducationOK.value = false;

  formData.value.termsOK = termsOK.value;
  formData.value.privacyOK = privacyOK.value;
  formData.value.systemEmail = agreementSystemEmailOK.value;
  formData.value.systemSMS = agreementSystemSMSOK.value;
  formData.value.newsEmail = agreementNewsEmailOK.value;
  formData.value.newsSMS = agreementNewsSMSOK.value;
  formData.value.educationEmail = agreementEducationEmailOK.value;
  formData.value.educationSMS = agreementEducationSMSOK.value;
}

async function onKeydownPhoneInput(e: KeyboardEvent) {
  e.stopPropagation();
  if (e.key === "Enter") phoneBtnClick();
}
async function onKeydownPhoneAuthCodeInput(e: KeyboardEvent) {
  e.stopPropagation();
  if (e.key === "Enter") phoneAuthCodeBtnClick();
}

onMounted(() => {
  // 브라우저 언어 코드랑, 전화번호 설정을 위한 국가 코드랑 달라서 맞춰
  let lang = appStore.lang;

  if (lang == "KO") {
    selectCountry(getCountryItem("KR"));
  } else if (lang == "JA") {
    selectCountry(getCountryItem("JP"));
  } else if (lang == "EN") {
    selectCountry(getCountryItem("US"));
  } else {
    console.log("invalid appStore.lang");
  }
  // 인풋 엔터 이벤트 부착
  const phoneInput = document.getElementById("phone-input");
  phoneInput?.addEventListener("keydown", onKeydownPhoneInput);
  const phoneAuthcodeInput = document.getElementById("phone-authcode-input");
  phoneAuthcodeInput?.addEventListener("keydown", onKeydownPhoneAuthCodeInput);
});
onBeforeUnmount(() => {
  // 인풋 엔터 이벤트 제거
  const phoneInput = document.getElementById("phone-input");
  phoneInput?.removeEventListener("keydown", onKeydownPhoneInput);
  const phoneAuthcodeInput = document.getElementById("phone-authcode-input");
  phoneAuthcodeInput?.removeEventListener(
    "keydown",
    onKeydownPhoneAuthCodeInput
  );
});
</script>

<style lang="scss" scoped>
@import "@/styles/signUp_outsourcing.scss";
.modal {
  z-index: 9999999999;
}
.signup-checkbox-label {
  font-weight: bold;
  font-size: 0- 0.6875rem;
  white-space: nowrap;
  margin-right: 0.25rem;
}
</style>
