// 'use client'; 를 추가하여 클라이언트 컴포넌트로 명시합니다.
'use client';

import { getRecommendInfo } from '@/api/apis/mypageApis';
import { useEffect, useState, ChangeEvent } from 'react';
import styles from './recommendSearch.module.scss';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// IRecommendInfo 타입 정의
interface IRecommendInfo {
  id: number;
  title: string;
  thumbnail: string;
  minPlaytime: number;
  maxPlaytime: number;
  genres: string[];
}

export default function RecommendSearch() {
  // 상태 변수 초기화
  const [recommendInfo, setRecommendInfo] = useState<IRecommendInfo[]>([]);
  const [filteredInfo, setFilteredInfo] = useState<IRecommendInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const cloud = process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN;
  const router = useRouter();

  // useSearchParams 훅을 사용하여 쿼리 파라미터 가져오기
  const params = useSearchParams();
  const query = params.get('query') || ''; // 쿼리가 없으면 빈 문자열로 초기화

  useEffect(() => {
    const fetchRecommendInfo = async () => {
      try {
        const res = await getRecommendInfo('MANY');
        setRecommendInfo(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchRecommendInfo();
  }, []);

  useEffect(() => {
    if (query) {
      const searchQuery = query.toLowerCase();
      const filtered = recommendInfo.filter(item =>
        item.title.toLowerCase().includes(searchQuery)
      );
      setFilteredInfo(filtered);
    } else {
      setFilteredInfo(recommendInfo);
    }
  }, [query, recommendInfo]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/recommendSearch?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className={styles.recoWrap}>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder={'보드게임 이름으로 전체검색 해보세요!'}
          value={searchQuery}
          onChange={handleChange}
          onKeyPress={e => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <button onClick={handleSearch}>
          <Image
            width={24}
            height={24}
            src={'/assets/icons/search.svg'}
            alt=""
          />
        </button>
      </div>
      <div className={styles.recoTabWrap}>
        <Link href="/recommend">2인 게임</Link>
        <Link href="/recommendThree">3인 게임</Link>
        <Link href="/recommendMany">다인용 게임</Link>
        <Link href="/recommendAll">전체</Link>
      </div>
      <div className={styles.recoListWrap}>
        {filteredInfo.map((e, i) => (
          <div className={styles.recoItem} key={i}>
            <div className={styles.img}>
              <Image
                width={555}
                height={555}
                src={`https://${cloud}/${e.thumbnail}`}
                alt="상황별 추천 게임 이미지"
                unoptimized={true}
              />
            </div>
            <h1 className={styles.title}>{e.title}</h1>
            <div className={styles.info}>
              <span className={styles.person}>
                <Image
                  width={20}
                  height={20}
                  src={'/assets/icons/user.svg'}
                  alt=""
                />
                2명
              </span>
              <span className={styles.time}>
                <Image
                  width={12}
                  height={12}
                  src={'/assets/icons/situ_clock.svg'}
                  alt=""
                />
                {e.minPlaytime}분~{e.maxPlaytime}분
              </span>
            </div>
            <div className={styles.category}>
              {e.genres.map((genre, genreI) => (
                <span key={genreI}>{genre}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
