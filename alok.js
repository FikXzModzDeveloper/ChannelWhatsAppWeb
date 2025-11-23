        let fullId = "";

        async function fetchData() {
            const input = document.getElementById('urlInput');
            const btn = document.getElementById('btnCheck');
            const loader = document.getElementById('loader');
            const result = document.getElementById('resultCard');
            const url = input.value.trim();

            if (!url) {
                Swal.fire({
                    icon: 'info',
                    text: 'Silakan tempel link channel terlebih dahulu.',
                    confirmButtonColor: '#2563eb',
                    customClass: { popup: 'rounded-2xl text-sm' }
                });
                return;
            }

            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
            btn.classList.add('opacity-80');
            
            result.classList.add('hidden');
            loader.classList.remove('hidden');

            try {
                const response = await fetch(`https://api.fikmydomainsz.xyz/tools/cekidwhtsp?url=${encodeURIComponent(url)}`);
                const data = await response.json();

                if (data && data.result) {
                    renderData(data.result);
                    loader.classList.add('hidden');
                    result.classList.remove('hidden');
                } else {
                    throw new Error("Invalid");
                }

            } catch (error) {
                loader.classList.add('hidden');
                Swal.fire({
                    icon: 'error',
                    text: 'Gagal mengambil data. Periksa link anda.',
                    confirmButtonColor: '#2563eb',
                    customClass: { popup: 'rounded-2xl text-sm' }
                });
            } finally {
                btn.disabled = false;
                btn.innerHTML = '<span>Mulai Analisa</span> <i class="fa-solid fa-arrow-right-long"></i>';
                btn.classList.remove('opacity-80');
            }
        }

        function renderData(data) {
            fullId = data.id;

            const img = document.getElementById('resPhoto');
            img.src = data.photo || 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg';
            img.onerror = () => img.src = 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg';

            document.getElementById('resName').textContent = data.name;
            document.getElementById('resFollowers').textContent = parseInt(data.pengikut || 0).toLocaleString('id-ID');
            
            let shortId = data.id.replace('@newsletter', '');
            if(shortId.length > 12) shortId = shortId.substring(0, 12) + '...';
            document.getElementById('resIdShort').textContent = shortId;

            document.getElementById('resDesc').innerHTML = linkify(data.deskripsi || "-");

            const badge = document.getElementById('resVerified');
            if(data.verified === "Ya" || data.verified === true) {
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }

            const stateEl = document.getElementById('resState');
            if(data.state === 'ACTIVE') {
                stateEl.textContent = "ACTIVE";
                stateEl.className = "text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border bg-emerald-50 text-emerald-600 border-emerald-200";
            } else {
                stateEl.textContent = data.state;
                stateEl.className = "text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border bg-red-50 text-red-600 border-red-200";
            }

            if (data.kreatorTime) {
                const date = new Date(data.kreatorTime * 1000);
                document.getElementById('resDate').textContent = date.toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric'
                });
            } else {
                document.getElementById('resDate').textContent = "-";
            }
        }

        function copyId() {
            if (!fullId) return;
            navigator.clipboard.writeText(fullId).then(() => {
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top',
                    showConfirmButton: false,
                    timer: 1500,
                    customClass: { popup: 'rounded-xl text-xs font-bold' }
                });
                Toast.fire({ icon: 'success', title: 'ID Disalin' });
            });
        }

        function linkify(text) {
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            return text.replace(urlRegex, function(url) {
                return `<a href="${url}" target="_blank" class="text-blue-600 font-medium hover:underline">${url}</a>`;
            });
        }
