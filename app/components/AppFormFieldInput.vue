<script setup lang="ts">
import type { FormFieldProps, ButtonProps } from '@nuxt/ui';
type Props = Omit<FormFieldProps, 'class'>
  // eslint-disable-next-line vue/require-default-prop
  & { classField?: any; type: string; pattern?: string; }
  ;

defineOptions({ inheritAttrs: false })
const model = defineModel<any | undefined | null>();

const { classField, required, ...formFieldProps } = defineProps<Props>();

const clearButtonProps: ButtonProps = { color: 'neutral', variant: 'link', size: 'sm', icon: 'i-lucide-circle-x' }
</script>

<template>
  <UFormField v-bind="formFieldProps" :required :class="classField">
    <slot>
      <USelect v-if="type == 'select'" v-model="model" v-bind="$attrs"/>
      <UTextarea v-else-if="type == 'textarea'" v-model="model" v-bind="$attrs" />
      <UInput
        v-else
        v-model.optional="model"
        :type
        v-bind="$attrs"
        :ui="{ trailing: 'pe-1' }"
      >
        <template v-if="model && type == 'text'" #trailing>
          <UButton v-bind="clearButtonProps" @click="model = null"/>
        </template>
      </UInput>
    </slot>
  </UFormField>
</template>
