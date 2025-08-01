import { test, expect } from '@playwright/test';

test('새 메모 작성 테스트', async ({ page }) => {
  // 1. 메인 페이지로 이동합니다.
  await page.goto('http://localhost:3000');

  // 2. '새 메모' 버튼을 클릭합니다.
  await page.getByRole('button', { name: '새 메모' }).click();

  // 3. 메모 생성 폼이 나타나는지 확인합니다.
  await expect(page.getByRole('heading', { name: '새 메모 작성' })).toBeVisible();

  // 4. '제목' 입력란에 "새 테스트 메모"를 입력합니다.
  await page.getByRole('textbox', { name: '제목 *' }).fill('새 테스트 메모');

  // 5. '내용' 입력란에 "이것은 E2E 테스트를 위한 메모입니다."를 입력합니다.
  await page.locator('textarea').fill('이것은 E2E 테스트를 위한 메모입니다.');

  // 6. '카테고리'를 "학습"으로 선택합니다.
  await page.getByLabel('카테고리').selectOption('학습');

  // 7. '저장하기' 버튼을 클릭합니다.
  await page.getByRole('button', { name: '저장하기' }).click();

  // 8. 메모 목록에 "새 테스트 메모"가 성공적으로 추가되었는지 확인합니다.
  const firstMemo = page.locator('div.grid > div').first();
  await expect(firstMemo.getByRole('heading', { name: '새 테스트 메모' })).toBeVisible();
  await expect(firstMemo.getByText('이것은 E2E 테스트를 위한 메모입니다.')).toBeVisible();
  await expect(firstMemo.getByText('학습')).toBeVisible();
});
