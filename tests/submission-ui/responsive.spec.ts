import {test,expect} from '@playwright/test';
test('delayed widget fits narrow forms and changes size without retaining a token',async({page})=>{
 await page.route('**/turnstile/v0/api.js*',async route=>{await new Promise(r=>setTimeout(r,2500));await route.fulfill({contentType:'application/javascript',body:`window.turnstile={render(el,o){const box=document.createElement('div');box.dataset.testWidgetSize=o.size;box.style.width=o.size==='compact'?'150px':'300px';box.style.height=o.size==='compact'?'140px':'65px';box.textContent='Fictional widget layout test';el.append(box);window.testWidgetOptions=o;return 'layout-widget'},remove(){document.querySelector('.kd-captcha').replaceChildren()},reset(){}};`});});
 await page.route('**/api/v1/taxonomy',route=>route.fulfill({json:{categories:[],localities:[]}}));
 await page.setViewportSize({width:320,height:844});await page.goto('/submit-business');
 for(const [width,size] of [[320,'compact'],[390,'compact'],[1440,'normal'],[320,'compact']] as const){
  await page.setViewportSize({width,height:844});
  await expect(page.locator('[data-test-widget-size]')).toHaveAttribute('data-test-widget-size',size);
  await page.waitForTimeout(2700);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);
  const box=await page.locator('[data-test-widget-size]').boundingBox();expect(box!.x+box!.width).toBeLessThanOrEqual(width);
 }
 const button=page.getByRole('button',{name:'Submit for review'});await expect(button).toBeDisabled();
 await page.evaluate(()=>{(window as Window & {testWidgetOptions:{callback:(v:string)=>void}}).testWidgetOptions.callback('fictional-layout-token')});
 await expect(button).toBeEnabled();
 await page.setViewportSize({width:1440,height:844});await expect(page.locator('[data-test-widget-size]')).toHaveAttribute('data-test-widget-size','normal');await expect(button).toBeDisabled();
});
