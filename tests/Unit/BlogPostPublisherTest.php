<?php

namespace Tests\Unit;

use App\Events\BlogPostPublished;
use App\Models\BlogPost;
use App\Models\User;
use App\Services\BlogPostPublisher;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class BlogPostPublisherTest extends TestCase
{
    use RefreshDatabase;

    public function test_publish_transitions_post_and_dispatches_event(): void
    {
        Event::fake([BlogPostPublished::class]);

        $author = User::factory()->create();
        $post   = BlogPost::create([
            'author_id' => $author->id,
            'title'     => 'Test Post',
            'slug'      => 'test-post',
            'body'      => 'Body text',
            'status'    => 'scheduled',
            'publish_at'=> now()->subMinute(),
        ]);

        app(BlogPostPublisher::class)->publish($post);

        $post->refresh();

        $this->assertSame('published', $post->status);
        $this->assertNotNull($post->published_at);
        $this->assertNull($post->publish_at);

        Event::assertDispatched(BlogPostPublished::class, fn ($event) => $event->post->is($post));
    }

    public function test_publish_is_idempotent_for_already_published_posts(): void
    {
        Event::fake([BlogPostPublished::class]);

        $author = User::factory()->create();
        $post   = BlogPost::create([
            'author_id'    => $author->id,
            'title'        => 'Live Post',
            'slug'         => 'live-post',
            'body'         => 'Body text',
            'status'       => 'published',
            'published_at' => now()->subDay(),
        ]);

        app(BlogPostPublisher::class)->publish($post);

        Event::assertNotDispatched(BlogPostPublished::class);
    }
}
