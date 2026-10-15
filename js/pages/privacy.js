// Privacy Policy Page
import { render } from '../main.js';

export async function renderPrivacyPage() {
    const html = `
        <div class="privacy-page">
            <div class="container">
                <div class="page-header">
                    <h1 class="page-title">개인정보처리방침</h1>
                    <p class="page-subtitle">최종 수정일: 2025년 12월 2일</p>
                </div>

                <div class="privacy-content card">
                    <section class="privacy-section">
                        <h2>1. 개인정보의 처리 목적</h2>
                        <p>(주)미디어즘(이하 "회사")은 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
                        <ul>
                            <li>상담 및 문의사항 처리</li>
                            <li>서비스 제공 및 계약 이행</li>
                            <li>마케팅 및 광고 활용 (선택적 동의)</li>
                        </ul>
                    </section>

                    <section class="privacy-section">
                        <h2>2. 개인정보의 처리 및 보유 기간</h2>
                        <p>회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>
                        <ul>
                            <li>상담 및 문의: 상담 완료 후 1년</li>
                            <li>계약 이행: 계약 종료 후 5년 (상법 규정)</li>
                        </ul>
                    </section>

                    <section class="privacy-section">
                        <h2>3. 처리하는 개인정보의 항목</h2>
                        <p>회사는 다음의 개인정보 항목을 처리하고 있습니다.</p>
                        <ul>
                            <li>필수항목: 성명, 연락처(전화번호, 이메일)</li>
                            <li>선택항목: 회사명, 부서명, 직책</li>
                        </ul>
                    </section>

                    <section class="privacy-section">
                        <h2>4. 개인정보의 제3자 제공</h2>
                        <p>회사는 원칙적으로 정보주체의 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다.</p>
                        <ul>
                            <li>정보주체로부터 별도의 동의를 받은 경우</li>
                            <li>법률에 특별한 규정이 있거나 법령상 의무를 준수하기 위하여 불가피한 경우</li>
                        </ul>
                    </section>

                    <section class="privacy-section">
                        <h2>5. 개인정보의 파기</h2>
                        <p>회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.</p>
                        <ul>
                            <li>전자적 파일: 복구 및 재생되지 않도록 안전하게 삭제</li>
                            <li>종이 문서: 분쇄기로 분쇄하거나 소각</li>
                        </ul>
                    </section>

                    <section class="privacy-section">
                        <h2>6. 정보주체의 권리·의무 및 행사방법</h2>
                        <p>정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.</p>
                        <ul>
                            <li>개인정보 열람 요구</li>
                            <li>오류 등이 있을 경우 정정 요구</li>
                            <li>삭제 요구</li>
                            <li>처리정지 요구</li>
                        </ul>
                    </section>

                    <section class="privacy-section">
                        <h2>7. 개인정보 보호책임자</h2>
                        <p>회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
                        <div class="contact-box">
                            <p><strong>개인정보 보호책임자</strong></p>
                            <p>연락처: 010-3287-8984</p>
                            <p>이메일: media00041@naver.com</p>
                        </div>
                    </section>

                    <section class="privacy-section">
                        <h2>8. 개인정보 처리방침 변경</h2>
                        <p>이 개인정보 처리방침은 2025년 12월 2일부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.</p>
                    </section>
                </div>

                <div class="section-cta">
                    <button class="btn btn-outline" onclick="window.history.back()">
                        ← 뒤로 가기
                    </button>
                </div>
            </div>
        </div>
    `;
    
    render(html);
}
