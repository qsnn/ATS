package com.platform.ats.service;

import com.platform.ats.entity.favorite.JobFavorite;
import com.platform.ats.repository.JobFavoriteRepository;
import com.platform.ats.repository.JobInfoRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

public class JobFavoriteServiceImplTest {

    @Test
    void testRemoveFavoriteUpdatesDeleteFlag() {
        JobFavoriteRepository favoriteRepository = Mockito.mock(JobFavoriteRepository.class);
        JobInfoRepository jobInfoRepository = Mockito.mock(JobInfoRepository.class);
        JobFavoriteServiceImpl service = new JobFavoriteServiceImpl(favoriteRepository, jobInfoRepository);

        when(favoriteRepository.update(any(), any())).thenReturn(1);

        boolean result = service.removeFavorite(2L, 3L);
        Assertions.assertTrue(result);
        // 验证更新方法被调用一次，接受任意参数（包括空实体和更新条件）
        Mockito.verify(favoriteRepository, Mockito.times(1)).update(any(), any());
    }
}
