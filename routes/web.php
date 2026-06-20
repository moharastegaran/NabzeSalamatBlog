<?php

use App\Http\Controllers\AdBannerController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ContactMessageController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\BreakingNewsController;
use App\Http\Controllers\AssetController;
use App\Http\Controllers\CustomerTicketController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\BlogCategoryController;
use App\Http\Controllers\BlogCommentController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\BlogPostController;
use App\Http\Controllers\BlogTagController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\BlogAnalyticsController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\CustomerPanelController;
use App\Http\Controllers\CustomerProfileController;
use App\Http\Controllers\MaintenanceController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Maintenance page (exempt from maintenance middleware — avoids redirect loop)
Route::get('/maintenance', [MaintenanceController::class, 'show'])->name('front.maintenance');

// Public routes (gated by maintenance mode)
Route::middleware('front.maintenance')->group(function () {
    Route::get('/',            [ShopController::class, 'landing'])->name('front.landing');
    Route::get('/about-us',    [ShopController::class, 'aboutUs'])     ->name('front.about-us');
    Route::get('/contact',     [ShopController::class, 'contact'])     ->name('front.contact');
    Route::post('/contact',    [ContactController::class, 'store'])   ->name('front.contact.store');
    Route::get('/gallery',     [ShopController::class, 'gallery'])     ->name('front.gallery');

    // Public blog
    Route::get('/blog',                         [BlogController::class, 'index'])   ->name('front.blog.index');
    Route::get('/blog/search',                  [BlogController::class, 'search'])  ->name('front.blog.search');
    Route::get('/blog/category/{slug}',         [BlogController::class, 'category']) ->name('front.blog.category');
    Route::get('/blog/tag/{slug}',              [BlogController::class, 'tag'])      ->name('front.blog.tag');
    Route::get('/blog/{slug}',                  [BlogController::class, 'show'])     ->name('front.blog.show');
    Route::post('/blog/{post}/comments', [BlogCommentController::class, 'store'])->name('blog.comments.store');
});

// Customer panel (authenticated customers only)
Route::middleware(['auth', 'role:customer'])->group(function () {
    Route::get('/customer/panel',      [CustomerPanelController::class, 'index'])     ->name('customer.panel');
    Route::get('/customer/activities', [CustomerPanelController::class, 'activities'])->name('customer.activities');
    Route::get('/customer/address',    [CustomerProfileController::class, 'address']) ->name('customer.address');
    Route::patch('/customer/address',  [CustomerProfileController::class, 'updateAddress'])->name('customer.address.update');
    Route::get('/customer/profile',    [CustomerProfileController::class, 'userInfo'])->name('customer.profile');
    Route::patch('/customer/profile',  [CustomerProfileController::class, 'updateUserInfo'])->name('customer.profile.update');

    // Customer tickets
    Route::get('/customer/tickets',                       [CustomerTicketController::class, 'index']) ->name('customer.tickets.index');
    Route::get('/customer/tickets/create',                [CustomerTicketController::class, 'create'])->name('customer.tickets.create');
    Route::post('/customer/tickets',                      [CustomerTicketController::class, 'store']) ->name('customer.tickets.store');
    Route::get('/customer/tickets/{ticket}',              [CustomerTicketController::class, 'show'])  ->name('customer.tickets.show');
    Route::post('/customer/tickets/{ticket}/reply',       [CustomerTicketController::class, 'reply'])->name('customer.tickets.reply');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/profile',    [ProfileController::class, 'edit'])   ->name('profile.edit');
    Route::patch('/profile',  [ProfileController::class, 'update']) ->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Maintenance toggle (admin only)
    Route::post('/maintenance/toggle', [MaintenanceController::class, 'toggle'])
        ->name('maintenance.toggle')
        ->middleware('role:admin');

    // Contact messages (admin only)
    Route::middleware('role:admin')->group(function () {
        Route::get   ('/contact-messages',                          [ContactMessageController::class, 'index'])   ->name('contact-messages.index');
        Route::patch ('/contact-messages/{message}/mark-read',      [ContactMessageController::class, 'markRead'])->name('contact-messages.markRead');
        Route::delete('/contact-messages/{message}',                [ContactMessageController::class, 'destroy']) ->name('contact-messages.destroy');
        Route::get   ('/contact-messages/{message}/attachment',     [ContactMessageController::class, 'download'])->name('contact-messages.download');
    });

    // Ad Banners (admin only)
    Route::middleware('role:admin')->group(function () {
        Route::get   ('/ad-banners',                        [AdBannerController::class, 'index'])       ->name('ad-banners.index');
        Route::get   ('/ad-banners/create',                 [AdBannerController::class, 'create'])      ->name('ad-banners.create');
        Route::post  ('/ad-banners',                        [AdBannerController::class, 'store'])       ->name('ad-banners.store');
        Route::get   ('/ad-banners/{adBanner}/edit',        [AdBannerController::class, 'edit'])        ->name('ad-banners.edit');
        Route::put   ('/ad-banners/{adBanner}',             [AdBannerController::class, 'update'])      ->name('ad-banners.update');
        Route::patch ('/ad-banners/{adBanner}/toggle',      [AdBannerController::class, 'toggleActive'])->name('ad-banners.toggle');
        Route::delete('/ad-banners/{adBanner}',             [AdBannerController::class, 'destroy'])     ->name('ad-banners.destroy');
    });

    // Breaking News (admin only)
    Route::middleware('role:admin')->group(function () {
        Route::get('/breaking-news',                     [BreakingNewsController::class, 'index'])  ->name('breaking-news.index');
        Route::post('/breaking-news',                    [BreakingNewsController::class, 'store'])  ->name('breaking-news.store');
        Route::put('/breaking-news/{breakingNews}',      [BreakingNewsController::class, 'update']) ->name('breaking-news.update');
        Route::delete('/breaking-news/{breakingNews}',   [BreakingNewsController::class, 'destroy'])->name('breaking-news.destroy');
    });

    // Role management (admin only)
    Route::middleware('role:admin')->group(function () {
        Route::get('/roles',                  [RoleController::class, 'index'])  ->name('roles.index');
        Route::post('/roles',                 [RoleController::class, 'store'])  ->name('roles.store');
        Route::put('/roles/{role}',           [RoleController::class, 'update']) ->name('roles.update');
        Route::patch('/roles/{role}/rename',  [RoleController::class, 'rename']) ->name('roles.rename');
        Route::delete('/roles/{role}',        [RoleController::class, 'destroy'])->name('roles.destroy');
    });

    // Notifications
    Route::get('/notifications',                        [NotificationController::class, 'index'])     ->name('notifications.index');
    Route::post('/notifications/mark-read',             [NotificationController::class, 'markRead'])  ->name('notifications.markRead');
    Route::patch('/notifications/{id}/mark-read',       [NotificationController::class, 'markOneRead'])->name('notifications.markOneRead');

    // Assets — data endpoint first (before {asset} wildcard)
    Route::get('/assets/data', [AssetController::class, 'data'])->name('assets.data')->middleware('role:admin|writer');
    Route::middleware('role:admin')->group(function () {
        Route::get('/assets',            [AssetController::class, 'index'])  ->name('assets.index');
        Route::post('/assets',           [AssetController::class, 'store'])  ->name('assets.store');
        Route::delete('/assets/{asset}', [AssetController::class, 'destroy'])->name('assets.destroy');
    });

    // Gallery (admin & cfo only)
    Route::middleware('role:admin|cfo')->group(function () {
        Route::get('/gallery-items',              [GalleryController::class, 'index'])  ->name('gallery.index');
        Route::post('/gallery-items',             [GalleryController::class, 'store'])  ->name('gallery.store');
        Route::delete('/gallery-items/{gallery}', [GalleryController::class, 'destroy'])->name('gallery.destroy');
    });

    // Announcements (admin & cfo only)
    Route::middleware('role:admin|cfo')->group(function () {
        Route::get('/announcements',                        [AnnouncementController::class, 'index']) ->name('announcements.index');
        Route::post('/announcements',                       [AnnouncementController::class, 'store']) ->name('announcements.store');
        Route::patch('/announcements/{announcement}/recall',[AnnouncementController::class, 'recall'])->name('announcements.recall');
    });

    // Tickets (all authenticated staff)
    Route::get('/tickets',                   [TicketController::class, 'index'])       ->name('tickets.index');
    Route::get('/tickets/create',            [TicketController::class, 'create'])      ->name('tickets.create');
    Route::post('/tickets',                  [TicketController::class, 'store'])       ->name('tickets.store');
    Route::get('/tickets/{ticket}',          [TicketController::class, 'show'])        ->name('tickets.show');
    Route::post('/tickets/{ticket}/reply',   [TicketController::class, 'reply'])       ->name('tickets.reply');
    Route::patch('/tickets/{ticket}/status', [TicketController::class, 'updateStatus'])->name('tickets.updateStatus');
    Route::delete('/tickets/{ticket}',       [TicketController::class, 'destroy'])     ->name('tickets.destroy')->middleware('role:admin');

    // Notes
    Route::get('/notes',                  [NoteController::class, 'index']) ->name('notes.index');
    Route::post('/notes',                 [NoteController::class, 'store']) ->name('notes.store');
    Route::patch('/notes/{note}/toggle',  [NoteController::class, 'toggle'])->name('notes.toggle');
    Route::delete('/notes/{note}',        [NoteController::class, 'destroy'])->name('notes.destroy');

    // Blog analytics (admin & writer only)
    Route::middleware('role:admin|writer')->group(function () {
        Route::get('/blog-analytics', [BlogAnalyticsController::class, 'index'])->name('analytics.blog');
    });

    // Blog (admin & writer only)
    Route::middleware('role:admin|writer')->group(function () {
        Route::get('/blog-posts',             [BlogPostController::class, 'index']) ->name('blog.index');
        Route::get('/blog-posts/create',      [BlogPostController::class, 'create'])->name('blog.create');
        Route::post('/blog-posts',            [BlogPostController::class, 'store']) ->name('blog.store');
        Route::get('/blog-posts/{blog}/edit', [BlogPostController::class, 'edit'])  ->name('blog.edit');
        Route::put('/blog-posts/{blog}',      [BlogPostController::class, 'update'])->name('blog.update');
        Route::delete('/blog-posts/{blog}',   [BlogPostController::class, 'destroy'])->name('blog.destroy');

        Route::get('/blog-categories',                        [BlogCategoryController::class, 'index']) ->name('blog.categories.index');
        Route::get('/blog-categories/create',                 [BlogCategoryController::class, 'create'])->name('blog.categories.create');
        Route::post('/blog-categories',                       [BlogCategoryController::class, 'store']) ->name('blog.categories.store');
        Route::get('/blog-categories/{blogCategory}/edit',    [BlogCategoryController::class, 'edit'])  ->name('blog.categories.edit');
        Route::put('/blog-categories/{blogCategory}',         [BlogCategoryController::class, 'update'])->name('blog.categories.update');
        Route::delete('/blog-categories/{blogCategory}',      [BlogCategoryController::class, 'destroy'])     ->name('blog.categories.destroy');
        Route::delete('/blog-categories',                     [BlogCategoryController::class, 'bulkDestroy'])->name('blog.categories.bulkDestroy');

        Route::get('/blog-tags',              [BlogTagController::class, 'index'])  ->name('blog.tags.index');
        Route::post('/blog-tags',             [BlogTagController::class, 'store'])  ->name('blog.tags.store');
        Route::put('/blog-tags/{blogTag}',    [BlogTagController::class, 'update']) ->name('blog.tags.update');
        Route::delete('/blog-tags/{blogTag}', [BlogTagController::class, 'destroy'])->name('blog.tags.destroy');

        Route::get('/blog-comments',                         [BlogCommentController::class, 'index'])  ->name('blog.comments.index');
        Route::patch('/blog-comments/{blogComment}/approve', [BlogCommentController::class, 'approve'])->name('blog.comments.approve');
        Route::delete('/blog-comments/{blogComment}',        [BlogCommentController::class, 'destroy'])->name('blog.comments.destroy');

        // Category field definitions
        Route::post  ('/blog-categories/{blogCategory}/fields',        [\App\Http\Controllers\CategoryFieldDefinitionController::class, 'store'])  ->name('blog.categories.fields.store');
        Route::put   ('/blog-categories/{blogCategory}/fields/{field}', [\App\Http\Controllers\CategoryFieldDefinitionController::class, 'update']) ->name('blog.categories.fields.update');
        Route::delete('/blog-categories/{blogCategory}/fields/{field}', [\App\Http\Controllers\CategoryFieldDefinitionController::class, 'destroy'])->name('blog.categories.fields.destroy');

        // Post media uploads
        Route::post  ('/blog-posts/{blog}/media',         [\App\Http\Controllers\PostMediaController::class, 'store'])  ->name('blog.media.store');
        Route::delete('/blog-posts/{blog}/media/{media}', [\App\Http\Controllers\PostMediaController::class, 'destroy'])->name('blog.media.destroy');
    });

    // Reports (admin & cfo only)
    Route::middleware('role:admin|cfo')->group(function () {
        Route::get('/reports',                    [ReportController::class, 'index'])        ->name('reports.index');
        Route::get('/reports/export/users',       [ReportController::class, 'exportUsers'])  ->name('reports.export.users');
        Route::get('/reports/export/users/pdf',   [ReportController::class, 'exportUsersPdf'])->name('reports.export.users.pdf');
    });

    // Users
    Route::get('/users',                      [UserController::class, 'index'])          ->name('users.index');
    Route::get('/users/create',               [UserController::class, 'create'])         ->name('users.create');
    Route::post('/users',                     [UserController::class, 'store'])          ->name('users.store');
    Route::get('/users/{user}/edit',          [UserController::class, 'edit'])           ->name('users.edit');
    Route::put('/users/{user}',               [UserController::class, 'update'])         ->name('users.update');
    Route::post('/users/{user}/suspend',      [UserController::class, 'suspend'])        ->name('users.suspend');
    Route::post('/users/{user}/reset-password',[UserController::class, 'resetPassword']) ->name('users.resetPassword');
    Route::delete('/users/{user}',            [UserController::class, 'destroy'])        ->name('users.destroy');
});

require __DIR__ . '/auth.php';
