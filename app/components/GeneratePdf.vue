<script setup lang="ts">
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

async function generatePDF() {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([600, 800])
  const { width, height } = page.getSize()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const text = `Der Erfurter Latrinensturz war ein Unglück bei einem königlichen Hoftag in Erfurt im Jahre 1184, bei dem etwa 60 Anwesende, darunter viele Adelige, umkamen und viele weitere verletzt wurden. Die Bezeichnung Latrinensturz kommt vom Hergang des Unfalls, bei dem die Opfer durch zwei Stockwerke der Dompropstei des Marienstiftes in die darunterliegende Toilettengrube fielen.`

  page.drawText(text, {
    x: 50,
    y: height - 50,
    size: 14,
    font,
    color: rgb(0, 0, 0),
    lineHeight: 18,
    maxWidth: width - 100,
  })

  const pdfBytes = await pdfDoc.save()

  const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'erfurt_disaster.pdf'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <ULink @click="generatePDF">
    <slot>
      Download Erfurt latrine disaster of 1184 PDF
    </slot>
  </ULink>

</template>
