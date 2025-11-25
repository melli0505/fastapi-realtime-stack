#!/bin/bash

# 실행할 파일 목록
files=(
    "subscriber1.sh"
    "subscriber2.sh"
    "subscriber3.sh"
    "subscriber4.sh"
    "subscriber5.sh"
)

# 각 파일을 백그라운드에서 실행
for file in "${files[@]}"; do
    if [[ -x "$file" ]]; then
        ./"$file" &
    else
        bash "$file" &
    fi
done

# 모든 백그라운드 프로세스가 끝날 때까지 대기
wait
echo "모든 subscriber가 종료되었습니다."