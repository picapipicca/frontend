import { usePathname, useRouter } from 'next/navigation';
import Modal from '..';
import styles from './LoginModal.module.scss';
import { useEffect, useState } from 'react';

interface ILoginModal {
  modalOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ modalOpen, onClose }: ILoginModal) {
  const router = useRouter();
  const pathname = usePathname();
  const currentURL = `${window.location.origin}${pathname}`;
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const handleGoToLoginPage = () => {
    document.cookie = `referer=${currentURL}; path=/`;
    router.push('/signin');
  };

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // 초기 로드 시 체크

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Modal modalOpen={modalOpen} onClose={onClose} maxWidth={552}>
      <div
        className={styles.modalBackground}
        style={{
          height: `${screenWidth * 0.3}px`,
          maxHeight: '150px',
          gap: `min(16px, ${(screenWidth * 16) / 600}px)`,
        }}>
        <p className={styles.title}>로그인이 필요합니다.</p>
        로그인 하시겠습니까?
      </div>
      <button
        type="button"
        onClick={handleGoToLoginPage}
        className={styles.modalFullButton}
        style={{ height: `${screenWidth * 0.15}px`, maxHeight: '75px' }}>
        로그인하러 가기
      </button>
    </Modal>
  );
}
