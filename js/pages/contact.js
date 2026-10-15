// Contact Page
import { render } from '../main.js?v=202610151006';
import { getIcon } from '../icons.js?v=202610151006';

export async function renderContactPage() {
    const contactData = await window.loadData('contact');
    const company = contactData?.company;
    
    const html = `
        <div class="contact-page">
            <div class="container">
                <!-- Page Header -->
                <div class="page-header">
                    <h1 class="page-title">문의</h1>
                    <p class="page-subtitle">프로젝트 상담이 필요하신가요? 언제든지 연락주세요</p>
                </div>

                <div class="contact-content">
                    <!-- Contact Info -->
                    <div class="contact-info-section">
                        <div class="card contact-info-card">
                            <h2>연락처 정보</h2>
                            
                            <div class="contact-info-item">
                                <div class="contact-icon">${getIcon('phone', 32)}</div>
                                <div class="contact-details">
                                    <h4>전화</h4>
                                    <a href="tel:${company?.phone?.replace(/-/g, '')}">${company?.phone || ''}</a>
                                </div>
                            </div>

                            <div class="contact-info-item">
                                <div class="contact-icon">${getIcon('email', 32)}</div>
                                <div class="contact-details">
                                    <h4>이메일</h4>
                                    <a href="mailto:${company?.email}">${company?.email || ''}</a>
                                </div>
                            </div>

                            <div class="contact-info-item">
                                <div class="contact-icon">${getIcon('location', 32)}</div>
                                <div class="contact-details">
                                    <h4>주소</h4>
                                    <p>${company?.address || ''}</p>
                                </div>
                            </div>

                            ${contactData?.businessHours ? `
                                <div class="contact-info-item">
                                    <div class="contact-icon">${getIcon('clock', 32)}</div>
                                    <div class="contact-details">
                                        <h4>운영 시간</h4>
                                        <p>평일: ${contactData.businessHours.weekdays}</p>
                                        <p>주말: ${contactData.businessHours.weekend}</p>
                                    </div>
                                </div>
                            ` : ''}
                        </div>

                        <!-- Download Brochure -->
                        <div class="card download-card">
                            <h3>회사소개서 다운로드</h3>
                            <p>MEDIA-ISM의 자세한 정보를 확인하세요</p>
                            <a href="./assets/pdf/(주)미디어즘 회사 소개서.pdf" class="btn btn-secondary" download>
                                <span class="btn-icon">${getIcon('download', 20)}</span>
                                PDF 다운로드
                            </a>
                        </div>
                    </div>

                    <!-- Map -->
                    <div class="contact-map-section">
                        <div class="card map-card">
                            <h2>찾아오시는 길</h2>
                            <div class="map-container">
                                <iframe 
                                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d324.5734901369787!2d126.91047858254673!3d37.3997451458467!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sko!2skr!4v1765426393871!5m2!1sko!2skr"
                                    width="100%" 
                                    height="400" 
                                    style="border:0;" 
                                    allowfullscreen="" 
                                    loading="lazy" 
                                    referrerpolicy="no-referrer-when-downgrade">
                                </iframe>
                            </div>
                            <div class="map-address">
                                <p><strong>${company?.address || ''}</strong></p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    `;
    
    render(html);
}
