@servers(['stage' => 'deployer@ip-172-31-60-100.us-west-2.compute.internal', 'alpha' => 'deployer@ip-172-31-57-128.us-west-2.compute.internal'])

@setup
    $repository = 'git@gitlab.com:dmecg/gryphon.git';
    $releases_dir = empty($production) ? '/var/www/stage-api/releases' : '/var/www/alpha-api/releases';
    $app_dir = empty($production) ? '/var/www/stage-api' : '/var/www/alpha-api';
    $target = empty($production) ? 'stage' : 'alpha';
    $release = date('YmdHis');
    $new_release_dir = $releases_dir .'/'. $release;
    // specify laravel dir for monorepo
    // $laravel_dir = $new_release_dir . '/API'
@endsetup

@story('deploy', ['on' => $target])
    clone_repository
    run_composer
    update_symlinks
@endstory

@task('clone_repository')
    echo 'Copying repository'
    cd /tmp;
    git archive --remote={{ $repository }} develop apps/backend | tar xvf -
    mv apps/backend {{ $new_release_dir }}
    # [ -d {{ $releases_dir }} ] || mkdir {{ $releases_dir }}
    # git clone --depth 1 {{ $repository }} {{ $new_release_dir }}
    cd {{ $new_release_dir }}
    # this will only work when deployed as merge request, not necessary for tar deployment
    # git reset --hard {{ $commit }}
@endtask

@task('run_composer')
    echo "Starting deployment ({{ $release }})"
    cd {{ $new_release_dir }}
    composer install --prefer-dist --no-scripts -q -o
@endtask

@task('update_symlinks')
    echo "Linking storage directory"
    rm -rf {{ $new_release_dir }}/storage
    ln -nfs {{ $app_dir }}/storage {{ $new_release_dir }}/storage

    echo 'Linking .env file'
    ln -nfs {{ $app_dir }}/.env {{ $new_release_dir }}/.env

    echo 'Run migrations'
    cd {{ $new_release_dir }}
    php artisan migrate --force

    echo 'Linking current release'
    ln -nfs {{ $new_release_dir }} {{ $app_dir }}/current
@endtask
