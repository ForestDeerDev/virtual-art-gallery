package com.artgallery.config;

import com.artgallery.entity.Artwork;
import com.artgallery.entity.User;
import com.artgallery.entity.UserRole;
import com.artgallery.repository.ArtworkRepository;
import com.artgallery.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Arrays;

/**
 * 数据初始化类
 * 在应用启动时自动创建测试数据
 * 
 * @author Art Gallery Team
 */
// @Component - 永久禁用数据初始化
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ArtworkRepository artworkRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, ArtworkRepository artworkRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.artworkRepository = artworkRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // 检查是否已有数据，如果有则跳过初始化
        if (userRepository.count() > 0) {
            System.out.println("数据库已有数据，跳过初始化");
            return;
        }

        System.out.println("开始初始化数据库...");

        // 创建管理员用户
        User admin = new User();
        admin.setUsername("admin");
        admin.setEmail("admin@artgallery.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(UserRole.ADMIN);
        admin.setEnabled(true);
        admin.setTagsList(Arrays.asList("管理", "艺术", "收藏"));
        admin = userRepository.save(admin);
        System.out.println("创建管理员用户: " + admin.getUsername());

        // 创建普通用户1
        User artist1 = new User();
        artist1.setUsername("artist1");
        artist1.setEmail("artist1@artgallery.com");
        artist1.setPassword(passwordEncoder.encode("123456"));
        artist1.setRole(UserRole.USER);
        artist1.setEnabled(true);
        artist1.setTagsList(Arrays.asList("油画", "水彩", "抽象艺术"));
        artist1 = userRepository.save(artist1);
        System.out.println("创建艺术家用户: " + artist1.getUsername());

        // 创建普通用户2
        User artist2 = new User();
        artist2.setUsername("artist2");
        artist2.setEmail("artist2@artgallery.com");
        artist2.setPassword(passwordEncoder.encode("123456"));
        artist2.setRole(UserRole.USER);
        artist2.setEnabled(true);
        artist2.setTagsList(Arrays.asList("素描", "雕塑", "写实"));
        artist2 = userRepository.save(artist2);
        System.out.println("创建艺术家用户: " + artist2.getUsername());

        // 创建艺术作品1
        Artwork artwork1 = new Artwork();
        artwork1.setTitle("抽象风景");
        artwork1.setArtist(artist1);
        artwork1.setCategory("油画");
        artwork1.setDescription("一幅充满想象力的抽象风景画，展现了艺术家对自然的独特理解。");
        artwork1.setImageUrl("https://images.unsplash.com/photo-1541961017774-22349e4a1262");
        artwork1.setTagsList(Arrays.asList("抽象", "风景", "现代艺术"));
        artwork1.setDimensions("100cm × 80cm");
        artwork1.setMaterial("布面油画");
        artwork1.setArtworkCreateTime(LocalDateTime.now().minusMonths(2));
        artwork1.setViewCount(150);
        artwork1.setLikeCount(25);
        artwork1.setFeatured(true);
        artwork1.setEnabled(true);
        artworkRepository.save(artwork1);
        System.out.println("创建艺术作品: " + artwork1.getTitle());

        // 创建艺术作品2
        Artwork artwork2 = new Artwork();
        artwork2.setTitle("静物写生");
        artwork2.setArtist(artist1);
        artwork2.setCategory("水彩");
        artwork2.setDescription("细腻的水彩静物画，展现了日常生活中的美好。");
        artwork2.setImageUrl("https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5");
        artwork2.setTagsList(Arrays.asList("静物", "水彩", "写实"));
        artwork2.setDimensions("50cm × 40cm");
        artwork2.setMaterial("水彩纸");
        artwork2.setArtworkCreateTime(LocalDateTime.now().minusMonths(1));
        artwork2.setViewCount(89);
        artwork2.setLikeCount(15);
        artwork2.setFeatured(false);
        artwork2.setEnabled(true);
        artworkRepository.save(artwork2);
        System.out.println("创建艺术作品: " + artwork2.getTitle());

        // 创建艺术作品3
        Artwork artwork3 = new Artwork();
        artwork3.setTitle("人物素描");
        artwork3.setArtist(artist2);
        artwork3.setCategory("素描");
        artwork3.setDescription("精湛的人物素描作品，展现了艺术家扎实的绘画功底。");
        artwork3.setImageUrl("https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0");
        artwork3.setTagsList(Arrays.asList("人物", "素描", "写实"));
        artwork3.setDimensions("60cm × 45cm");
        artwork3.setMaterial("素描纸");
        artwork3.setArtworkCreateTime(LocalDateTime.now().minusWeeks(2));
        artwork3.setViewCount(120);
        artwork3.setLikeCount(30);
        artwork3.setFeatured(true);
        artwork3.setEnabled(true);
        artworkRepository.save(artwork3);
        System.out.println("创建艺术作品: " + artwork3.getTitle());

        // 创建艺术作品4
        Artwork artwork4 = new Artwork();
        artwork4.setTitle("现代雕塑");
        artwork4.setArtist(artist2);
        artwork4.setCategory("雕塑");
        artwork4.setDescription("具有现代感的雕塑作品，展现了空间与形式的完美结合。");
        artwork4.setImageUrl("https://images.unsplash.com/photo-1567427017947-545c5f8d16ad");
        artwork4.setTagsList(Arrays.asList("雕塑", "现代", "抽象"));
        artwork4.setDimensions("高80cm");
        artwork4.setMaterial("青铜");
        artwork4.setArtworkCreateTime(LocalDateTime.now().minusWeeks(1));
        artwork4.setViewCount(200);
        artwork4.setLikeCount(45);
        artwork4.setFeatured(true);
        artwork4.setEnabled(true);
        artworkRepository.save(artwork4);
        System.out.println("创建艺术作品: " + artwork4.getTitle());

        System.out.println("数据库初始化完成！");
        System.out.println("管理员账号: admin / admin123");
        System.out.println("艺术家账号1: artist1 / 123456");
        System.out.println("艺术家账号2: artist2 / 123456");
    }
}



