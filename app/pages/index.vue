<script lang="ts" setup>
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const payloadSchema = z.object({
  name: z.string().describe('Your full name'),
  email: z.email().describe('Your email address'),
  message: z.string().optional().describe('Cover letter or additional message'),
  role: z.enum(RoleType).optional().describe('Your role in the company'),
  experienceYears: z.number().max(118).optional().describe('Years of experience'),
  experienceLevel: z.enum(ExperienceLevelType).optional().describe('Your experience level'),
  salary: z.number().optional().describe('Expected salary in EUR per month'),
}).describe('Your information')
type PayloadSchema = z.output<typeof payloadSchema>;

const schema = z.object({
  cv: z.file().describe('Your CV in PDF format'),
  payload: payloadSchema,
})
type Schema = z.output<typeof schema>;
type PartialSchema = Partial<Schema> & { payload: Partial<PayloadSchema> };

const state = reactive<PartialSchema>({
  payload: { name: 'Test', email: 'test@protonmail.com' }
});

const dryRun = ref(true);
const ui = computed(() => jsonSchemaToUISchema(z.toJSONSchema(payloadSchema)));

const toast = useToast()
async function onSubmit({ data }: FormSubmitEvent<Schema>) {
  const formData = new FormData();
  formData.append('cv', data.cv);
  formData.append('payload', JSON.stringify(data.payload));

  const headers = {};
  dryRun.value && Object.assign(headers, {'x-dry-run': 'true'});

  const timestamp = Date.now();
  const stringToSign = `${data.payload.name}-${timestamp}`;
  const signature = await sha256(stringToSign);
  Object.assign(headers, {
    'x-timestamp': timestamp.toString(),
    'x-signature': signature,
  });

  const res = await $fetch('/api/v1/candidates', { method: 'POST', headers, body: formData });

  toast.add({ color: 'info', title: 'Result', description: res.message, duration: 50000 })
}
</script>

<template>
  <UForm :schema :state @submit="onSubmit" class="space-y-4 max-w-xl mb-4">
    <h1>Bidpoint Candidate Application</h1>
    <GeneratePdf/>
    <UFormField label="CV in PDF format" description="Erfurt latrine disaster of 1184" name="cv" required>
      <UFileUpload v-model="state.cv" accept="application/pdf" class="w-full min-h-16" />
    </UFormField>

    <UForm :schema="payloadSchema" name="payload" class="grid gap-4 grid-cols-2" nested>
      <AppFormFieldInput v-bind="ui.name" v-model="state.payload.name" class="w-full" />
      <AppFormFieldInput v-bind="ui.email" v-model="state.payload.email" class="w-full" />
      <AppFormFieldInput v-bind="ui.message" v-model="state.payload.message" type="textarea" class="w-full" classField="col-span-2" />
      <AppFormFieldInput v-bind="ui.role" v-model="state.payload.role" class="w-full" />
      <AppFormFieldInput v-bind="ui.experienceYears" v-model="state.payload.experienceYears" class="w-full" />
      <AppFormFieldInput v-bind="ui.experienceLevel" v-model="state.payload.experienceLevel" class="w-full" />
      <AppFormFieldInput v-bind="ui.salary" v-model="state.payload.salary" class="w-full" />
    </UForm>
    <USwitch label="Dry Run" v-model="dryRun"></USwitch>
    <UButton type="submit">Submit</UButton>
  </UForm>
</template>
