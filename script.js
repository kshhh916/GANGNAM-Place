const firebaseConfig = {
  apiKey: "AIzaSyC0l0P9b87YrcXbJKgsUU1PpREFhbMLVBY",
  authDomain: "portfolio-board-6df90.firebaseapp.com",
  projectId: "portfolio-board-6df90",
  storageBucket: "portfolio-board-6df90.firebasestorage.app",
  messagingSenderId: "22683529596",
  appId: "1:22683529596:web:3c41651cc1d47444a974f9",
  measurementId: "G-3WV1D56PD1"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', () => {
    const sideMenu = document.getElementById('sideMenu');
    const hamburger = document.getElementById('hamburger');
    const closeBtn = document.getElementById('closeBtn');
    const sideNavLinks = document.querySelectorAll('.side-nav-links a');
    const sections = document.querySelectorAll('section[id]');

    // Toggle Side Menu
    if(hamburger) hamburger.addEventListener('click', () => {
        sideMenu.classList.add('open');
        updateActiveLink(); // Update highlight as soon as menu opens
    });

    if(closeBtn) closeBtn.addEventListener('click', () => {
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

    if(scrollTopBtn) scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    if(scrollBottomBtn) scrollBottomBtn.addEventListener('click', () => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (sideMenu && hamburger && sideMenu.classList.contains('open') && !sideMenu.contains(e.target) && !hamburger.contains(e.target)) {
            sideMenu.classList.remove('open');
        }
    });

    // Logo click to top and reset animations
    const logo = document.querySelector('.logo');
    if(logo) {
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
            
            setTimeout(() => {
                reveals.forEach(el => {
                    revealObserver.observe(el); // Re-observe to trigger isIntersecting for visible elements
                });
                updateActiveLink();
            }, 100);
        });
    }

    // Initial check
    updateActiveLink();

    // --- Guestbook Logic ---
    const guestbookForm = document.getElementById('guestbookForm');
    const boardList = document.getElementById('boardList');
    const toggleWriteBtn = document.getElementById('toggleWriteBtn');
    const cancelWriteBtn = document.getElementById('cancelWriteBtn');
    const writeModal = document.getElementById('writeModal');
    let isAdmin = false;
    let globalMessages = [];

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
        hours = hours ? hours : 12; 
        return `${yyyy}. ${mm}. ${dd}. ${ampm} ${hours}:${minutes}:${seconds}`;
    };

    const escapeHTML = (str) => {
        if(!str) return '';
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
        
        // Write Modal Close Logic
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
            
            window.addEventListener('click', (event) => {
                if (event.target === gbModal) {
                    gbModal.classList.remove('show');
                }
            });
        }
        
        // Delete Logic
        const gbDeleteBtn = document.getElementById('gbDeleteBtn');
        if (gbDeleteBtn) {
            gbDeleteBtn.addEventListener('click', async () => {
                if (!gbModal) return;
                const postId = gbModal.getAttribute('data-id');
                if (!postId) return;
                
                const msg = globalMessages.find(m => m.id === postId);
                
                if (msg) {
                    let canDelete = isAdmin;
                    if (!canDelete) {
                        if (!msg.password) {
                            alert('이전 게시글은 비밀번호가 설정되어 있지 않아 삭제할 수 없습니다.');
                            return;
                        }
                        const password = prompt('게시글을 삭제하려면 비밀번호를 입력하세요:');
                        if (password === null) return; 
                        
                        if (password === msg.password) canDelete = true;
                        else alert('비밀번호가 일치하지 않습니다.');
                    }
                    
                    if (canDelete) {
                        await db.collection("guestbook").doc(postId).delete();
                        gbModal.classList.remove('show');
                        alert('게시글이 삭제되었습니다.');
                    }
                }
            });
        }

        // Pin Logic
        const gbPinBtn = document.getElementById('gbPinBtn');
        if (gbPinBtn) {
            gbPinBtn.addEventListener('click', async () => {
                if (!isAdmin || !gbModal) return;
                const postId = gbModal.getAttribute('data-id');
                const msg = globalMessages.find(m => m.id === postId);
                if (msg) {
                    await db.collection("guestbook").doc(postId).update({
                        isPinned: !msg.isPinned
                    });
                    gbModal.classList.remove('show');
                }
            });
        }
        
        // Reaction Helper
        const handleReaction = async (item, type) => {
            const votes = JSON.parse(localStorage.getItem('ghp_votes')) || {};
            const prevVote = votes[item.id];
            let newLikes = item.likes || 0;
            let newDislikes = item.dislikes || 0;
            
            if (prevVote === type) {
                delete votes[item.id];
                if (type === 'like') newLikes = Math.max(0, newLikes - 1);
                else newDislikes = Math.max(0, newDislikes - 1);
            } else if (prevVote) {
                votes[item.id] = type;
                if (type === 'like') {
                    newLikes++;
                    newDislikes = Math.max(0, newDislikes - 1);
                } else {
                    newDislikes++;
                    newLikes = Math.max(0, newLikes - 1);
                }
            } else {
                votes[item.id] = type;
                if (type === 'like') newLikes++;
                else newDislikes++;
            }
            
            localStorage.setItem('ghp_votes', JSON.stringify(votes));
            
            await db.collection("guestbook").doc(item.id).update({
                likes: newLikes,
                dislikes: newDislikes
            });
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
            modalLikeBtn.addEventListener('click', async () => {
                const postId = gbModal.getAttribute('data-id');
                const msg = globalMessages.find(m => m.id === postId);
                if (msg) await handleReaction(msg, 'like');
            });
        }
        
        if (modalDislikeBtn) {
            modalDislikeBtn.addEventListener('click', async () => {
                const postId = gbModal.getAttribute('data-id');
                const msg = globalMessages.find(m => m.id === postId);
                if (msg) await handleReaction(msg, 'dislike');
            });
        }

        // Edit Post Logic
        const gbEditBtn = document.getElementById('gbEditBtn');
        if (gbEditBtn) {
            gbEditBtn.addEventListener('click', () => {
                if (!gbModal) return;
                const postId = gbModal.getAttribute('data-id');
                if (!postId) return;
                
                const msg = globalMessages.find(m => m.id === postId);
                
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
            const msg = globalMessages.find(m => m.id === postId);
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
                            ${c.isAdmin ? '<span class="meta-admin-badge">관리자</span>' : ''}
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
                
                const handleCommentReaction = async (comment, type) => {
                    const votes = JSON.parse(localStorage.getItem('ghp_votes')) || {};
                    const voteId = postId + '_' + comment.id;
                    const prevVote = votes[voteId];
                    let newLikes = comment.likes || 0;
                    let newDislikes = comment.dislikes || 0;
                    
                    if (prevVote === type) {
                        delete votes[voteId];
                        if (type === 'like') newLikes = Math.max(0, newLikes - 1);
                        else newDislikes = Math.max(0, newDislikes - 1);
                    } else if (prevVote) {
                        votes[voteId] = type;
                        if (type === 'like') {
                            newLikes++;
                            newDislikes = Math.max(0, newDislikes - 1);
                        } else {
                            newDislikes++;
                            newLikes = Math.max(0, newLikes - 1);
                        }
                    } else {
                        votes[voteId] = type;
                        if (type === 'like') newLikes++;
                        else newDislikes++;
                    }
                    localStorage.setItem('ghp_votes', JSON.stringify(votes));
                    
                    const newComments = comments.map(cm => {
                        if(cm.id === comment.id) {
                            return { ...cm, likes: newLikes, dislikes: newDislikes };
                        }
                        return cm;
                    });
                    
                    await db.collection("guestbook").doc(postId).update({ comments: newComments });
                };

                // Comment Like
                cItem.querySelector('.c-like-btn').addEventListener('click', () => {
                    handleCommentReaction(c, 'like');
                });
                
                // Comment Dislike
                cItem.querySelector('.c-dislike-btn').addEventListener('click', () => {
                    handleCommentReaction(c, 'dislike');
                });
                
                // Comment Edit
                cItem.querySelector('.c-edit-btn').addEventListener('click', async () => {
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
                            const newComments = comments.map(cm => {
                                if(cm.id === c.id) return { ...cm, text: newText.trim() };
                                return cm;
                            });
                            await db.collection("guestbook").doc(postId).update({ comments: newComments });
                        }
                    }
                });
                
                // Comment Delete
                cItem.querySelector('.c-del-btn').addEventListener('click', async () => {
                    let canDelete = isAdmin;
                    if (!canDelete) {
                        const pwd = prompt('댓글을 삭제하려면 비밀번호를 입력하세요:');
                        if (pwd === null) return;
                        if (pwd === c.password) canDelete = true;
                        else alert('비밀번호가 일치하지 않습니다.');
                    }
                    if (canDelete) {
                        const newComments = comments.filter(cm => cm.id !== c.id);
                        await db.collection("guestbook").doc(postId).update({ comments: newComments });
                    }
                });
                
                commentsList.appendChild(cItem);
            });
        };

        // Comment Form Submit
        const commentForm = document.getElementById('commentForm');
        if (commentForm) {
            commentForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const gbModal = document.getElementById('guestbookModal');
                const postId = gbModal ? gbModal.getAttribute('data-id') : null;
                if (!postId) return;
                
                const cName = document.getElementById('commentName').value.trim();
                const cPassword = document.getElementById('commentPassword').value.trim();
                const cText = document.getElementById('commentText').value.trim();
                
                if (cName && cPassword && cText) {
                    const msg = globalMessages.find(m => m.id === postId);
                    if (msg) {
                        const dateStr = getFormattedDate();
                        const newComment = {
                            id: Date.now().toString(),
                            name: cName,
                            password: cPassword,
                            text: cText,
                            date: dateStr,
                            likes: 0,
                            dislikes: 0,
                            isAdmin: isAdmin
                        };
                        const newComments = [...(msg.comments || []), newComment];
                        await db.collection("guestbook").doc(postId).update({ comments: newComments });
                        commentForm.reset();
                    }
                }
            });
        }

        // Render the board
        const renderBoard = (messages) => {
            boardList.innerHTML = '';
            const boardCount = document.getElementById('boardCount');
            if (boardCount) {
                boardCount.textContent = messages.length;
            }
            
            // Sort by pinned then by date (createdAt desc)
            messages.sort((a, b) => {
                const aPinned = Boolean(a.isPinned);
                const bPinned = Boolean(b.isPinned);
                if (aPinned !== bPinned) return bPinned ? 1 : -1;
                return (b.createdAt || 0) - (a.createdAt || 0);
            });
            
            messages.forEach((msg) => {
                const item = document.createElement('div');
                const pinnedClass = msg.isPinned ? ' pinned-post' : '';
                item.className = 'board-list-item reveal active' + pinnedClass;
                
                const displayTitle = msg.title ? escapeHTML(msg.title) : escapeHTML(msg.content.substring(0, 30)) + (msg.content.length > 30 ? '...' : '');
                const cCount = msg.comments ? msg.comments.length : 0;
                
                const pinnedLabel = msg.isPinned ? '<span class="pinned-label">📌 고정된 게시글</span>' : '';
                const adminBadge = msg.isAdmin ? '<span class="meta-admin-badge">관리자</span>' : '';
                
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
                
                const likeBtn = item.querySelector('.list-like-btn');
                if (likeBtn) {
                    likeBtn.addEventListener('click', async (e) => {
                        e.stopPropagation();
                        await handleReaction(msg, 'like');
                    });
                }
                
                const commentListBtn = item.querySelector('.comment-btn');
                if (commentListBtn) {
                    commentListBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        item.click();
                    });
                }
                
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

        // Firebase Realtime Listener
        db.collection("guestbook").onSnapshot((snapshot) => {
            const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            globalMessages = messages;
            renderBoard(messages);
            
            // Update open modal if exists
            if (gbModal && gbModal.classList.contains('show')) {
                const currentPostId = gbModal.getAttribute('data-id');
                const currentMsg = messages.find(m => m.id === currentPostId);
                if (currentMsg) {
                    updateModalReactions(currentMsg);
                    renderComments(currentPostId);
                    
                    const displayTitle = currentMsg.title ? escapeHTML(currentMsg.title) : escapeHTML(currentMsg.content.substring(0, 30)) + (currentMsg.content.length > 30 ? '...' : '');
                    document.getElementById('gbModalTitle').textContent = displayTitle;
                    document.getElementById('gbModalAuthor').textContent = currentMsg.name;
                    document.getElementById('gbModalDate').textContent = currentMsg.date;
                    document.getElementById('gbModalDesc').textContent = currentMsg.content;
                    if(gbPinBtn) gbPinBtn.textContent = currentMsg.isPinned ? '고정 해제' : '고정하기';
                } else {
                    gbModal.classList.remove('show');
                }
            }
        });

        // Handle Post form submission (Create / Edit)
        guestbookForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const editId = document.getElementById('editPostId').value;
            const nameInput = document.getElementById('gbName').value.trim();
            const passwordInput = document.getElementById('gbPassword').value.trim();
            const titleInput = document.getElementById('gbTitle').value.trim();
            const messageInput = document.getElementById('gbMessage').value.trim();

            if (nameInput && passwordInput && titleInput && messageInput) {
                if (editId) {
                    // Editing existing post
                    await db.collection("guestbook").doc(editId).update({
                        name: nameInput,
                        password: passwordInput,
                        title: titleInput,
                        content: messageInput
                    });
                } else {
                    // Creating new post
                    const dateStr = getFormattedDate();
                    await db.collection("guestbook").add({
                        name: nameInput,
                        password: passwordInput,
                        title: titleInput,
                        content: messageInput,
                        date: dateStr,
                        createdAt: Date.now(),
                        comments: [],
                        likes: 0,
                        dislikes: 0,
                        isPinned: false,
                        isAdmin: isAdmin
                    });
                }
                guestbookForm.reset();
                document.getElementById('editPostId').value = '';
                if (writeModal) writeModal.classList.remove('show');
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
window.openPortfolioModal = openPortfolioModal;

function closePortfolioModal() {
    const modal = document.getElementById('portfolioModal');
    if (modal) {
        modal.classList.remove('show');
    }
}
window.closePortfolioModal = closePortfolioModal;

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
            introModal.style.display = 'flex';
            document.body.classList.add('no-scroll');
        } else {
            if (window.startRevealAnimation) window.startRevealAnimation();
        }

        introConfirmBtn.addEventListener('click', () => {
            introModal.style.display = 'none';
            document.body.classList.remove('no-scroll');
            sessionStorage.setItem('introSeen', 'true');
            if (window.startRevealAnimation) window.startRevealAnimation();
        });
    } else {
        if (window.startRevealAnimation) window.startRevealAnimation();
    }
});
