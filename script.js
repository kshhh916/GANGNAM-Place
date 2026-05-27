document.addEventListener('DOMContentLoaded', () => {
    const sideMenu = document.getElementById('sideMenu');
    const hamburger = document.getElementById('hamburger');
    const closeBtn = document.getElementById('closeBtn');
    const sideNavLinks = document.querySelectorAll('.side-nav-links a');
    const sections = document.querySelectorAll('section[id]');

    // Toggle Side Menu
    hamburger.addEventListener('click', () => {
        sideMenu.classList.add('open');
        updateActiveLink(); // Update highlight as soon as menu opens
    });

    closeBtn.addEventListener('click', () => {
        sideMenu.classList.remove('open');
    });

    // Close menu when a link is clicked
    sideNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            sideMenu.classList.remove('open');
        });
    });

    // Scroll Reveal Interaction
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    window.startRevealAnimation = () => {
        document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    };

    // Function to update active link based on scroll position
    function updateActiveLink() {
        let current = '';
        const scrollPos = window.pageYOffset + 150; // Offset to detect section transition earlier

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        sideNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Update on scroll
    window.addEventListener('scroll', updateActiveLink);

    // Smooth scroll for side nav links (only for in-page anchors)
    sideNavLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Only apply smooth scroll if it's an anchor on the same page
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Scroll to Top and Bottom
    const scrollTopBtn = document.getElementById('scrollTop');
    const scrollBottomBtn = document.getElementById('scrollBottom');

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    scrollBottomBtn.addEventListener('click', () => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (sideMenu.classList.contains('open') && !sideMenu.contains(e.target) && !hamburger.contains(e.target)) {
            sideMenu.classList.remove('open');
        }
    });

    // Logo click to top and reset animations
    const logo = document.querySelector('.logo');
    logo.style.cursor = 'pointer';
    logo.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Reset animations
        const reveals = document.querySelectorAll('.reveal');
        reveals.forEach(el => {
            el.classList.remove('active');
            revealObserver.unobserve(el); // Stop observing to reset
        });
        
        // Use a small delay to allow the removal of 'active' to take effect
        // and then re-observe to trigger IntersectionObserver's logic
        setTimeout(() => {
            reveals.forEach(el => {
                revealObserver.observe(el); // Re-observe to trigger isIntersecting for visible elements
            });
            updateActiveLink();
        }, 100);
    });

    // Initial check
    updateActiveLink();

    // --- Guestbook Logic ---
    const guestbookForm = document.getElementById('guestbookForm');
    const boardList = document.getElementById('boardList');
    const toggleWriteBtn = document.getElementById('toggleWriteBtn');
    const cancelWriteBtn = document.getElementById('cancelWriteBtn');
    const writeModal = document.getElementById('writeModal');
    let isAdmin = false;

    const getFormattedDate = () => {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? '오후' : '오전';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        return `${yyyy}. ${mm}. ${dd}. ${ampm} ${hours}:${minutes}:${seconds}`;
    };

    if (guestbookForm && boardList) {
        // Admin Mode Toggle
        const adminModeBtn = document.getElementById('adminModeBtn');
        if (adminModeBtn) {
            adminModeBtn.addEventListener('click', () => {
                if (isAdmin) {
                    isAdmin = false;
                    adminModeBtn.textContent = '관리자 모드';
                    adminModeBtn.style.backgroundColor = '#555';
                    alert('관리자 모드가 해제되었습니다.');
                } else {
                    const pass = prompt('관리자 비밀번호를 입력하세요:');
                    if (pass === 'tmdgus04?!@#') {
                        isAdmin = true;
                        adminModeBtn.textContent = '관리자 모드 (ON)';
                        adminModeBtn.style.backgroundColor = '#ff6b6b';
                        alert('관리자 모드가 켜졌습니다. 비밀번호 없이 삭제 및 수정이 가능합니다.');
                    } else if (pass !== null) {
                        alert('비밀번호가 틀렸습니다.');
                    }
                }
            });
        }
        // Toggle write form
        if (toggleWriteBtn && writeModal) {
            toggleWriteBtn.addEventListener('click', () => {
                document.getElementById('editPostId').value = '';
                guestbookForm.reset();
                writeModal.classList.add('show');
            });
        }
        
        if (cancelWriteBtn && writeModal) {
            cancelWriteBtn.addEventListener('click', () => {
                writeModal.classList.remove('show');
                guestbookForm.reset();
            });
        }
        
        // Write Modal Close Logic (X and outside)
        const closeWriteModal = document.getElementById('closeWriteModal');
        if (closeWriteModal && writeModal) {
            closeWriteModal.addEventListener('click', () => {
                writeModal.classList.remove('show');
                guestbookForm.reset();
            });
            window.addEventListener('click', (event) => {
                if (event.target === writeModal) {
                    writeModal.classList.remove('show');
                    guestbookForm.reset();
                }
            });
        }

        // Guestbook Modal Close Logic
        const closeGuestbookModalBtn = document.getElementById('closeGuestbookModal');
        const gbModal = document.getElementById('guestbookModal');
        
        if (closeGuestbookModalBtn && gbModal) {
            closeGuestbookModalBtn.addEventListener('click', () => {
                gbModal.classList.remove('show');
            });
            
            // Close on outside click
            window.addEventListener('click', (event) => {
                if (event.target === gbModal) {
                    gbModal.classList.remove('show');
                }
            });
        }
        
        // Delete Logic
        const gbDeleteBtn = document.getElementById('gbDeleteBtn');
        if (gbDeleteBtn) {
            gbDeleteBtn.addEventListener('click', () => {
                if (!gbModal) return;
                const postId = gbModal.getAttribute('data-id');
                if (!postId) return;
                
                const messages = JSON.parse(localStorage.getItem('ghp_messages')) || [];
                const msg = messages.find(m => m.id == postId);
                
                if (msg) {
                    let canDelete = isAdmin;
                    if (!canDelete) {
                        if (!msg.password) {
                            alert('이전 게시글은 비밀번호가 설정되어 있지 않아 삭제할 수 없습니다.');
                            return;
                        }
                        const password = prompt('게시글을 삭제하려면 비밀번호를 입력하세요:');
                        if (password === null) return; // Cancelled
                        
                        if (password === msg.password) canDelete = true;
                        else alert('비밀번호가 일치하지 않습니다.');
                    }
                    
                    if (canDelete) {
                        const newMessages = messages.filter(m => m.id != postId);
                        localStorage.setItem('ghp_messages', JSON.stringify(newMessages));
                        gbModal.classList.remove('show');
                        loadMessages();
                        alert('게시글이 삭제되었습니다.');
                    }
                }
            });
        }

        // Pin Logic
        const gbPinBtn = document.getElementById('gbPinBtn');
        if (gbPinBtn) {
            gbPinBtn.addEventListener('click', () => {
                if (!isAdmin || !gbModal) return;
                const postId = gbModal.getAttribute('data-id');
                const messages = JSON.parse(localStorage.getItem('ghp_messages')) || [];
                const msg = messages.find(m => m.id == postId);
                if (msg) {
                    msg.isPinned = !msg.isPinned;
                    localStorage.setItem('ghp_messages', JSON.stringify(messages));
                    loadMessages();
                    gbModal.classList.remove('show');
                }
            });
        }
        
        // Reaction Helper
        const handleReaction = (item, type) => {
            const votes = JSON.parse(localStorage.getItem('ghp_votes')) || {};
            const prevVote = votes[item.id];
            
            if (prevVote === type) {
                // 동일한 버튼을 다시 누른 경우 -> 취소
                delete votes[item.id];
                if (type === 'like') item.likes = Math.max(0, (item.likes || 1) - 1);
                else item.dislikes = Math.max(0, (item.dislikes || 1) - 1);
            } else if (prevVote) {
                // 다른 버튼으로 변경하는 경우
                votes[item.id] = type;
                if (type === 'like') {
                    item.likes = (item.likes || 0) + 1;
                    item.dislikes = Math.max(0, (item.dislikes || 1) - 1);
                } else {
                    item.dislikes = (item.dislikes || 0) + 1;
                    item.likes = Math.max(0, (item.likes || 1) - 1);
                }
            } else {
                // 새로운 평가인 경우
                votes[item.id] = type;
                if (type === 'like') item.likes = (item.likes || 0) + 1;
                else item.dislikes = (item.dislikes || 0) + 1;
            }
            
            localStorage.setItem('ghp_votes', JSON.stringify(votes));
            return true;
        };
        
        // Modal Like / Dislike Logic
        const modalLikeBtn = document.getElementById('modalLikeBtn');
        const modalDislikeBtn = document.getElementById('modalDislikeBtn');
        
        const updateModalReactions = (msg) => {
            if (modalLikeBtn) modalLikeBtn.querySelector('span').textContent = msg.likes || 0;
            if (modalDislikeBtn) modalDislikeBtn.querySelector('span').textContent = msg.dislikes || 0;
        };
        
        if (modalLikeBtn) {
            modalLikeBtn.addEventListener('click', () => {
                const postId = gbModal.getAttribute('data-id');
                const messages = JSON.parse(localStorage.getItem('ghp_messages')) || [];
                const msg = messages.find(m => m.id == postId);
                if (msg && handleReaction(msg, 'like')) {
                    localStorage.setItem('ghp_messages', JSON.stringify(messages));
                    updateModalReactions(msg);
                    loadMessages(); // update list silently
                }
            });
        }
        
        if (modalDislikeBtn) {
            modalDislikeBtn.addEventListener('click', () => {
                const postId = gbModal.getAttribute('data-id');
                const messages = JSON.parse(localStorage.getItem('ghp_messages')) || [];
                const msg = messages.find(m => m.id == postId);
                if (msg && handleReaction(msg, 'dislike')) {
                    localStorage.setItem('ghp_messages', JSON.stringify(messages));
                    updateModalReactions(msg);
                    loadMessages();
                }
            });
        }

        // Edit Post Logic
        const gbEditBtn = document.getElementById('gbEditBtn');
        if (gbEditBtn) {
            gbEditBtn.addEventListener('click', () => {
                if (!gbModal) return;
                const postId = gbModal.getAttribute('data-id');
                if (!postId) return;
                
                const messages = JSON.parse(localStorage.getItem('ghp_messages')) || [];
                const msg = messages.find(m => m.id == postId);
                
                if (msg) {
                    let canEdit = isAdmin;
                    if (!canEdit) {
                        if (!msg.password) {
                            alert('이전 게시글은 비밀번호가 없어 수정할 수 없습니다.');
                            return;
                        }
                        const password = prompt('게시글을 수정하려면 비밀번호를 입력하세요:');
                        if (password === null) return;
                        if (password === msg.password) canEdit = true;
                        else alert('비밀번호가 일치하지 않습니다.');
                    }
                    
                    if (canEdit) {
                        document.getElementById('editPostId').value = postId;
                        document.getElementById('gbName').value = msg.name;
                        document.getElementById('gbTitle').value = msg.title || '';
                        document.getElementById('gbMessage').value = msg.content;
                        document.getElementById('gbPassword').value = msg.password || '';
                        
                        gbModal.classList.remove('show');
                        writeModal.classList.add('show');
                    }
                }
            });
        }

        // Render Comments Logic
        const renderComments = (postId) => {
            const messages = JSON.parse(localStorage.getItem('ghp_messages')) || [];
            const msg = messages.find(m => m.id == postId);
            const commentsList = document.getElementById('modalCommentsList');
            const commentCount = document.getElementById('gbCommentCount');
            
            if (!msg || !commentsList) return;
            
            const comments = msg.comments || [];
            if (commentCount) commentCount.textContent = comments.length;
            commentsList.innerHTML = '';
            
            comments.forEach(c => {
                const cItem = document.createElement('div');
                cItem.style.cssText = 'margin-bottom: 15px; padding: 15px; background: #fff; border-radius: 8px; border: 1px solid #eaeaea; box-shadow: 0 2px 5px rgba(0,0,0,0.02);';
                cItem.innerHTML = `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.85rem; color: #888;">
                        <div>
                            <span style="font-weight: 600; color: #444;">${escapeHTML(c.name)}</span>
                            ${c.isAdmin ? `<span class="meta-admin-badge">관리자</span>` : ''}
                        </div>
                        <div style="display: flex; align-items: center;">
                            <span>${c.date}</span>
                            <button class="reaction-badge c-like-btn" style="padding: 2px 6px; font-size: 0.75rem; margin-left: 10px;">👍 <span>${c.likes || 0}</span></button>
                            <button class="reaction-badge c-dislike-btn" style="padding: 2px 6px; font-size: 0.75rem; margin-left: 5px;">👎 <span>${c.dislikes || 0}</span></button>
                            <button class="c-edit-btn" style="background: none; border: none; font-size: 0.75rem; color: #bfa07d; cursor: pointer; margin-left: 10px; text-decoration: underline;">수정</button>
                            <button class="c-del-btn" style="background: none; border: none; font-size: 0.75rem; color: #ff6b6b; cursor: pointer; margin-left: 5px; text-decoration: underline;">삭제</button>
                        </div>
                    </div>
                    <div style="font-size: 0.95rem; color: #333; line-height: 1.5;">${escapeHTML(c.text)}</div>
                `;
                
                // Comment Like
                cItem.querySelector('.c-like-btn').addEventListener('click', () => {
                    if (handleReaction(c, 'like')) {
                        localStorage.setItem('ghp_messages', JSON.stringify(messages));
                        renderComments(postId);
                    }
                });
                
                // Comment Dislike
                cItem.querySelector('.c-dislike-btn').addEventListener('click', () => {
                    if (handleReaction(c, 'dislike')) {
                        localStorage.setItem('ghp_messages', JSON.stringify(messages));
                        renderComments(postId);
                    }
                });
                
                // Comment Edit
                cItem.querySelector('.c-edit-btn').addEventListener('click', () => {
                    let canEdit = isAdmin;
                    if (!canEdit) {
                        const pwd = prompt('댓글을 수정하려면 비밀번호를 입력하세요:');
                        if (pwd === null) return;
                        if (pwd === c.password) canEdit = true;
                        else alert('비밀번호가 일치하지 않습니다.');
                    }
                    if (canEdit) {
                        const newText = prompt('수정할 내용을 입력하세요:', c.text);
                        if (newText !== null && newText.trim() !== '') {
                            c.text = newText.trim();
                            localStorage.setItem('ghp_messages', JSON.stringify(messages));
                            renderComments(postId);
                            loadMessages();
                        }
                    }
                });
                
                // Comment Delete
                cItem.querySelector('.c-del-btn').addEventListener('click', () => {
                    let canDelete = isAdmin;
                    if (!canDelete) {
                        const pwd = prompt('댓글을 삭제하려면 비밀번호를 입력하세요:');
                        if (pwd === null) return;
                        if (pwd === c.password) canDelete = true;
                        else alert('비밀번호가 일치하지 않습니다.');
                    }
                    if (canDelete) {
                        msg.comments = msg.comments.filter(cm => cm.id !== c.id);
                        localStorage.setItem('ghp_messages', JSON.stringify(messages));
                        renderComments(postId);
                        loadMessages();
                    }
                });
                
                commentsList.appendChild(cItem);
            });
        };

        // Comment Form Submit
        const commentForm = document.getElementById('commentForm');
        if (commentForm) {
            commentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const gbModal = document.getElementById('guestbookModal');
                const postId = gbModal ? gbModal.getAttribute('data-id') : null;
                if (!postId) return;
                
                const cName = document.getElementById('commentName').value.trim();
                const cPassword = document.getElementById('commentPassword').value.trim();
                const cText = document.getElementById('commentText').value.trim();
                
                if (cName && cPassword && cText) {
                    const messages = JSON.parse(localStorage.getItem('ghp_messages')) || [];
                    const msgIndex = messages.findIndex(m => m.id == postId);
                    
                    if (msgIndex !== -1) {
                        if (!messages[msgIndex].comments) messages[msgIndex].comments = [];
                        const dateStr = getFormattedDate();
                        
                        messages[msgIndex].comments.push({
                            id: Date.now(),
                            name: cName,
                            password: cPassword,
                            text: cText,
                            date: dateStr,
                            likes: 0,
                            dislikes: 0,
                            isAdmin: isAdmin
                        });
                        
                        localStorage.setItem('ghp_messages', JSON.stringify(messages));
                        commentForm.reset();
                        renderComments(postId);
                        loadMessages();
                    }
                }
            });
        }

        // Load messages from LocalStorage
        const loadMessages = () => {
            let messages = JSON.parse(localStorage.getItem('ghp_messages')) || [];
            let needsSave = false;
            
            // Data Migration: Ensure all old messages and comments have IDs
            messages.forEach((msg, index) => {
                if (!msg.id) {
                    msg.id = Date.now() - (100000 - index); // Give old posts sequential past timestamps
                    needsSave = true;
                }
                if (msg.comments) {
                    msg.comments.forEach((c, cIdx) => {
                        if (!c.id) {
                            c.id = Date.now() - (50000 - cIdx);
                            needsSave = true;
                        }
                    });
                }
            });
            if (needsSave) {
                localStorage.setItem('ghp_messages', JSON.stringify(messages));
            }
            
            boardList.innerHTML = '';
            
            const boardCount = document.getElementById('boardCount');
            if (boardCount) {
                boardCount.textContent = messages.length;
            }
            
            messages.sort((a, b) => {
                const aPinned = Boolean(a.isPinned);
                const bPinned = Boolean(b.isPinned);
                if (aPinned !== bPinned) return bPinned ? 1 : -1;
                return b.id - a.id;
            });
            
            messages.forEach((msg) => {
                const item = document.createElement('div');
                const pinnedClass = msg.isPinned ? ' pinned-post' : '';
                item.className = 'board-list-item reveal active' + pinnedClass;
                
                // Fallback for old messages without a title
                const displayTitle = msg.title ? escapeHTML(msg.title) : escapeHTML(msg.content.substring(0, 30)) + (msg.content.length > 30 ? '...' : '');
                const cCount = msg.comments ? msg.comments.length : 0;
                
                const pinnedLabel = msg.isPinned ? `<span class="pinned-label">📌 고정된 게시글</span>` : '';
                const adminBadge = msg.isAdmin ? `<span class="meta-admin-badge">관리자</span>` : '';
                
                item.innerHTML = `
                    <div class="item-main">
                        ${pinnedLabel}
                        <div class="item-title">${displayTitle}</div>
                        <div class="item-content-preview">${escapeHTML(msg.content)}</div>
                    </div>
                    <div class="item-meta">
                        <div>
                            <span class="meta-author">${escapeHTML(msg.name)}</span> ${adminBadge}
                        </div>
                        <span class="meta-date">${msg.date}</span>
                        <div class="reaction-badges" style="margin-top: 10px; justify-content: flex-end;">
                            <button class="reaction-badge list-like-btn">👍 <span>${msg.likes || 0}</span></button>
                            <button class="reaction-badge comment-btn">답글 <span>${cCount}</span></button>
                        </div>
                    </div>
                `;
                
                // Click on like in list view
                const likeBtn = item.querySelector('.list-like-btn');
                if (likeBtn) {
                    likeBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        if (handleReaction(msg, 'like')) {
                            localStorage.setItem('ghp_messages', JSON.stringify(messages));
                            loadMessages();
                        }
                    });
                }
                
                // Click on comment btn in list view (just opens modal)
                const commentListBtn = item.querySelector('.comment-btn');
                if (commentListBtn) {
                    commentListBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        item.click(); // trigger modal
                    });
                }
                
                // Show modal on click
                item.addEventListener('click', () => {
                    const gbModal = document.getElementById('guestbookModal');
                    if (gbModal) {
                        gbModal.setAttribute('data-id', msg.id || '');
                        document.getElementById('gbModalTitle').textContent = displayTitle;
                        document.getElementById('gbModalAuthor').textContent = msg.name;
                        document.getElementById('gbModalDate').textContent = msg.date;
                        document.getElementById('gbModalDesc').textContent = msg.content;
                        
                        if (gbPinBtn) {
                            gbPinBtn.style.display = isAdmin ? 'inline-block' : 'none';
                            gbPinBtn.textContent = msg.isPinned ? '고정 해제' : '고정하기';
                        }
                        
                        updateModalReactions(msg);
                        renderComments(msg.id);
                        
                        gbModal.classList.add('show');
                    }
                });
                
                boardList.appendChild(item);
            });
        };

        // Escape HTML to prevent XSS
        const escapeHTML = (str) => {
            return str.replace(/[&<>'"]/g, 
                tag => ({
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    "'": '&#39;',
                    '"': '&quot;'
                }[tag])
            );
        };

        // Initial Load
        loadMessages();

        // Handle Post form submission (Create / Edit)
        guestbookForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const editId = document.getElementById('editPostId').value;
            const nameInput = document.getElementById('gbName').value.trim();
            const passwordInput = document.getElementById('gbPassword').value.trim();
            const titleInput = document.getElementById('gbTitle').value.trim();
            const messageInput = document.getElementById('gbMessage').value.trim();

            if (nameInput && passwordInput && titleInput && messageInput) {
                const messages = JSON.parse(localStorage.getItem('ghp_messages')) || [];
                
                if (editId) {
                    // Editing existing post
                    const msgIndex = messages.findIndex(m => m.id == editId);
                    if (msgIndex !== -1) {
                        messages[msgIndex].name = nameInput;
                        messages[msgIndex].password = passwordInput;
                        messages[msgIndex].title = titleInput;
                        messages[msgIndex].content = messageInput;
                        // Keep original date and comments
                    }
                } else {
                    // Creating new post
                    const dateStr = getFormattedDate();
                    
                    messages.push({
                        id: Date.now(),
                        name: nameInput,
                        password: passwordInput,
                        title: titleInput,
                        content: messageInput,
                        date: dateStr,
                        comments: [],
                        likes: 0,
                        dislikes: 0,
                        isPinned: false,
                        isAdmin: isAdmin
                    });
                }

                localStorage.setItem('ghp_messages', JSON.stringify(messages));
                guestbookForm.reset();
                document.getElementById('editPostId').value = '';
                if (writeModal) {
                    writeModal.classList.remove('show');
                }
                loadMessages();
            }
        });
    }
});

// 포트폴리오 모달 로직
const portfolioData = {
    card2: {
        title: "로봇 전문가를 향한 첫걸음",
        img1: "portfolio_popup_edu1.jpg",
        img2: "portfolio_popup_edu2.jpg",
        desc: "로봇 공학의 기초를 다진 인덕과학기술고등학교 시절, 전공 학과실습실에서 동기들과 함께한 기록입니다. 공학도라는 공통된 목표 아래 서로 지식을 교류하고 실무 역량을 키우며 성장해왔으며, 이는 현재 동양미래대학교 로봇자동화공학부에서의 심도 있는 학업으로 이어지는 든든한 밑거름이 되었습니다."
    },
    card3: {
        title: "한계에 도전한 시간, 28사단 수색대대",
        img1: "portfolio_popup_mil1.jpg",
        img2: "portfolio_popup_mil2.jpg",
        desc: "대한민국 육군 28사단 수색대대에서 국방의 의무를 성실히 완수한 기록입니다. 강도 높은 훈련과 통제된 환경 속에서 스스로의 한계를 극복하는 법을 배웠으며, 굳건한 책임감과 리더십, 그리고 조직 내 협업의 중요성을 체득할 수 있었던 의미 있는 성장의 시간이었습니다."
    },
    card4: {
        title: "에너지를 채우는 소중한 시간들",
        img1: "portfolio_popup_life1.jpg",
        img2: "portfolio_popup_life2.jpg",
        desc: "학업과 자기 계발 등 바쁜 일과 속에서도 주변 사람들과 소통하며 재충전의 시간을 갖는 일상의 단편입니다. 폭넓은 대인관계를 통해 유연한 사고방식과 소통 능력을 기르고 있으며, 이러한 긍정적인 에너지는 새로운 과제와 목표에 끊임없이 도전할 수 있는 강력한 원동력으로 작용하고 있습니다."
    }
};

function openPortfolioModal(cardId) {
    const modal = document.getElementById('portfolioModal');
    const data = portfolioData[cardId];
    if (modal && data) {
        document.getElementById('modalTitle').textContent = data.title;
        document.getElementById('modalImg1').src = data.img1;
        document.getElementById('modalImg2').src = data.img2;
        document.getElementById('modalDesc').textContent = data.desc;
        modal.classList.add('show');
    }
}

function closePortfolioModal() {
    const modal = document.getElementById('portfolioModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// 모달 바깥 영역 클릭 시 닫기
window.addEventListener('click', function(event) {
    const modal = document.getElementById('portfolioModal');
    if (event.target === modal) {
        closePortfolioModal();
    }
});

// Intro Modal Logic
document.addEventListener('DOMContentLoaded', () => {
    const introModal = document.getElementById('introModal');
    const introConfirmBtn = document.getElementById('introConfirmBtn');

    if (introModal && introConfirmBtn) {
        if (!sessionStorage.getItem('introSeen')) {
            // Show modal and prevent scrolling, wait for click to animate
            introModal.style.display = 'flex';
            document.body.classList.add('no-scroll');
        } else {
            // Already seen, start animation immediately
            if (window.startRevealAnimation) window.startRevealAnimation();
        }

        introConfirmBtn.addEventListener('click', () => {
            introModal.style.display = 'none';
            document.body.classList.remove('no-scroll');
            sessionStorage.setItem('introSeen', 'true');
            // Trigger the reveal animation now!
            if (window.startRevealAnimation) window.startRevealAnimation();
        });
    } else {
        // Not on index.html (no modal), start immediately
        if (window.startRevealAnimation) window.startRevealAnimation();
    }
});
